import ImageUploader from "../imageUploader";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {UploaderUtils} from "../uploaderUtils";
import {buildS3RequestHandler, type ProxySetting} from "../../net/proxy";

export default class B2Uploader implements ImageUploader {
  private readonly s3!: S3Client;
  private readonly bucket!: string;
  private readonly region: string;
  private pathTmpl: string;
  private customDomainName: string;

  constructor(setting: B2Setting, proxy?: ProxySetting) {
    const region = UploaderUtils.trimCredential(setting.region);
    this.region = region;
    const endpoint = `https://s3.${region}.backblazeb2.com`;
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: UploaderUtils.trimCredential(setting.accessKeyId),
        secretAccessKey: UploaderUtils.trimCredential(setting.secretAccessKey),
      },
      endpoint,
      region,
      forcePathStyle: true,
      requestHandler: buildS3RequestHandler(endpoint, proxy),
    });
    this.bucket = UploaderUtils.trimCredential(setting.bucketName);
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
    const url = `https://${this.bucket}.s3.${this.region}.backblazeb2.com/${path}`;
    return UploaderUtils.customizeDomainName(url, this.customDomainName);
  }
}

export interface B2Setting {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
  path: string;
  customDomainName: string;
}
