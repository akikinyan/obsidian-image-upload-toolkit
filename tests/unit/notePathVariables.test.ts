import {describe, expect, it} from "vitest";
import {UploaderUtils} from "../../src/uploader/uploaderUtils";
import {withNoteVariables} from "../../src/uploader/imageUploaderBuilder";
import type {PublishSettings} from "../../src/publish";

describe("noteVariables", () => {
    it("takes the folder the note sits in, not the whole relative path", () => {
        expect(UploaderUtils.noteVariables("notes/2026/trip.md")).toEqual({
            folderName: "2026",
            noteName: "trip",
        });
    });

    it("gives no folder for a note at the vault root", () => {
        expect(UploaderUtils.noteVariables("trip.md")).toEqual({folderName: "", noteName: "trip"});
    });

    it("strips only the markdown extension, whatever its case", () => {
        expect(UploaderUtils.noteVariables("a/Trip.MD").noteName).toBe("Trip");
        // a dot inside the name is part of the name
        expect(UploaderUtils.noteVariables("a/v1.2 notes.md").noteName).toBe("v1.2 notes");
    });

    it("survives an empty path", () => {
        expect(UploaderUtils.noteVariables("")).toEqual({folderName: "", noteName: ""});
    });
});

describe("expandNoteVariables", () => {
    it("fills both variables in", () => {
        expect(UploaderUtils.expandNoteVariables("img/{foldername}/{notename}/{filename}", "notes/2026/trip.md"))
            .toBe("img/2026/trip/{filename}");
    });

    it("returns the template unchanged when it uses neither", () => {
        const template = "img/{year}/{filename}";
        expect(UploaderUtils.expandNoteVariables(template, "notes/trip.md")).toBe(template);
    });

    it("collapses the empty segment a root note would leave behind", () => {
        // "img//{filename}" would be a different remote key, and a URL with a
        // double slash in it
        expect(UploaderUtils.expandNoteVariables("img/{foldername}/{filename}", "trip.md"))
            .toBe("img/{filename}");
    });

    it("replaces every occurrence, not just the first", () => {
        expect(UploaderUtils.expandNoteVariables("{notename}/{notename}-{filename}", "a/trip.md"))
            .toBe("trip/trip-{filename}");
    });

    it("leaves the other variables for generateName", () => {
        expect(UploaderUtils.expandNoteVariables("{notename}/{year}/{filename}", "a/trip.md"))
            .toBe("trip/{year}/{filename}");
    });
});

describe("withNoteVariables", () => {
    function settings(overrides: Partial<PublishSettings> = {}): PublishSettings {
        return {
            imageStore: "AWS_S3",
            awsS3Setting: {
                accessKeyId: "k",
                secretAccessKey: "s",
                region: "us-east-1",
                bucketName: "blog",
                path: "img/{notename}/{filename}",
                customDomainName: "",
                endpoint: "",
            },
            imgurAnonymousSetting: {clientId: "cid"},
            ...overrides,
        } as unknown as PublishSettings;
    }

    it("expands the active store's template", () => {
        const expanded = withNoteVariables(settings(), "notes/2026/trip.md");

        expect(expanded.awsS3Setting.path).toBe("img/trip/{filename}");
    });

    it("does not mutate the settings it was given", () => {
        const base = settings();
        withNoteVariables(base, "notes/trip.md");

        expect(base.awsS3Setting.path).toBe("img/{notename}/{filename}");
    });

    it("returns the same object when the template has no note variables", () => {
        const base = settings({
            awsS3Setting: {...settings().awsS3Setting, path: "img/{year}/{filename}"},
        } as Partial<PublishSettings>);

        // identity is what tells publish() the held uploader is still correct
        expect(withNoteVariables(base, "notes/trip.md")).toBe(base);
    });

    it("returns the same object for a store with no path template", () => {
        const base = settings({imageStore: "IMGUR"});

        expect(withNoteVariables(base, "notes/trip.md")).toBe(base);
    });

    it("keeps the rest of the store's settings intact", () => {
        const expanded = withNoteVariables(settings(), "notes/2026/trip.md");

        expect(expanded.awsS3Setting.bucketName).toBe("blog");
        expect(expanded.awsS3Setting.region).toBe("us-east-1");
    });

    it("works for GitHub too, which gained a path template in 10.0.0", () => {
        const base = settings({
            imageStore: "GITHUB",
            githubSetting: {
                repositoryName: "owner/images",
                branchName: "main",
                token: "t",
                path: "assets/{foldername}/{filename}",
            },
        } as Partial<PublishSettings>);

        expect(withNoteVariables(base, "notes/2026/trip.md").githubSetting.path)
            .toBe("assets/2026/{filename}");
    });
});
