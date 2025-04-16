import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.CLOUDFLARE_R2_REGION,
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});
