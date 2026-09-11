import ImageUploader from "../imageUploader";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {UploaderUtils} from "../uploaderUtils";
import {buildS3RequestHandler, type ProxySetting} from "../../net/proxy";

/**
 * SigV4 needs a region to sign with even when the server does not care which
 * one it is, and S3-compatible services generally do not. Anything consistent
 * works, so fall back to the region AWS itself treats as the default rather
 * than making the field mandatory for a MinIO install that has no region.
 */
const SIGNING_REGION_FALLBACK = "us-east-1";

export default class AwsS3Uploader implements ImageUploader {
  private readonly s3!: S3Client;
  private readonly bucket!: string;
  private readonly region: string;
  private readonly endpoint: string;
  private pathTmpl: string;
  private customDomainName: string;


  constructor(setting: AwsS3Setting, proxy?: ProxySetting) {
    const endpoint = UploaderUtils.normalizeEndpoint(setting.endpoint);
    const region = UploaderUtils.trimCredential(setting.region) || (endpoint ? SIGNING_REGION_FALLBACK : "");
    // Which host the request goes to decides whether the proxy applies to it
    // at all, so the custom endpoint has to reach buildS3RequestHandler and
    // not just the SDK: NO_PROXY commonly exempts exactly the internal host a
    // self-hosted S3 runs on.
    const requestTarget = endpoint || `https://s3.${region}.amazonaws.com`;
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: UploaderUtils.trimCredential(setting.accessKeyId),
        secretAccessKey: UploaderUtils.trimCredential(setting.secretAccessKey),
      },
      region,
      // A custom endpoint means a service that is S3-compatible but does not
      // own a wildcard domain, so the bucket cannot live in the hostname.
      ...(endpoint ? {endpoint, forcePathStyle: true} : {}),
      requestHandler: buildS3RequestHandler(requestTarget, proxy),
    });
    this.bucket = UploaderUtils.trimCredential(setting.bucketName);
    this.region = region;
    this.endpoint = endpoint;
    this.pathTmpl = setting.path;
    this.customDomainName = setting.customDomainName;
  }

  async upload(image: File, fullPath: string): Promise<string> {
    const arrayBuffer = await image.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let path = UploaderUtils.generateName(this.pathTmpl, image.name);
    path = path.replace(/^\/+/, ''); // remove the /
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: path,
      Body: uint8Array,
      ContentType: UploaderUtils.resolveContentType(image),
    }));
    // Path-style keeps the bucket as the first path segment, so a custom
    // domain in front of a custom endpoint must point at the server rather
    // than at the bucket — customizeDomainName only swaps the host.
    const location = this.endpoint
      ? `${this.endpoint}/${this.bucket}/${path}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${path}`;
    return UploaderUtils.customizeDomainName(location, this.customDomainName);
  }
}
export interface AwsS3Setting {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
  path: string;
  customDomainName: string;
  /** S3-compatible endpoint, e.g. a MinIO install. Empty means real AWS S3. */
  endpoint: string;
}
