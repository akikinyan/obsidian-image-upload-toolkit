/**
 * Guard against the four places a release version lives drifting apart:
 * manifest.json, package.json, versions.json and the git tag.
 *
 * Obsidian resolves an update by reading `version` out of the manifest.json
 * attached to a release, while the release itself is named after the tag that
 * triggered the workflow. Nothing checks that the two agree, so a tag pushed
 * without the matching bump publishes a release whose assets advertise the
 * previous version — Obsidian then keeps offering the "update" it has already
 * installed, and BRAT reinstalls the same bytes on every check.
 *
 * The tag comparison runs only when a tag push is building, which the release
 * workflow does and CI does not. Running it from the production build rather
 * than from the workflow is deliberate: this fork's token carries no `workflow`
 * scope, so .github/workflows/ cannot be pushed from the CLI, while
 * `npm run build` is already the workflow's own build step.
 */
import {readFile} from "node:fs/promises";

const read = async (path) => JSON.parse(await readFile(path, "utf8"));

const [manifest, pkg, versions] = await Promise.all([
    read("manifest.json"),
    read("package.json"),
    read("versions.json"),
]);

const problems = [];

if (manifest.version !== pkg.version) {
    problems.push(`manifest.json says ${manifest.version} but package.json says ${pkg.version}`);
}

const recorded = versions[manifest.version];
if (recorded === undefined) {
    problems.push(`versions.json has no entry for ${manifest.version}`);
} else if (recorded !== manifest.minAppVersion) {
    problems.push(
        `versions.json maps ${manifest.version} to Obsidian ${recorded}, ` +
        `but manifest.json requires ${manifest.minAppVersion}`,
    );
}

// GITHUB_REF_TYPE/NAME are set for every step of an Actions run, so the tag is
// readable here without the workflow passing it in.
if (process.env.GITHUB_REF_TYPE === "tag") {
    const tag = process.env.GITHUB_REF_NAME;
    if (tag !== manifest.version) {
        problems.push(`the tag being released is ${tag} but manifest.json says ${manifest.version}`);
    }
}

if (problems.length > 0) {
    console.error("Release version mismatch:");
    for (const problem of problems) {
        console.error(`  - ${problem}`);
    }
    process.exit(1);
}
