import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../utils/s3client.js";
import { ResponseError } from "../error/response-error.js";
import { Validation } from "../validation/validation.js";
import { ImageValidation } from "../validation/image-validation.js";
import { v4 as uuidv4 } from "uuid";
import { AuthError, createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv'

dotenv.config()


export class ImageService {
  static getKeyFromUrl(url) {
    const publicUrlBase = process.env.CLOUDFLARE_R2_PUBLIC_URL + "/";
    return url.startsWith(publicUrlBase)
      ? url.slice(publicUrlBase.length)
      : url;
  }

  static async upload(request) {
    if (request.images.length < 1) {
      throw new ResponseError(
        "error",
        400,
        "Gambar yang diunggah minimal 1 gambar",
      );
    }

    const filesRequest = await Validation.validate(
      ImageValidation.UPLOAD,
      request,
    );

    const images = [];

    for (const file of filesRequest.images) {
      const uniqueFileName = `${uuidv4()}`;
      const key = `${request.entity}/${uniqueFileName}`;

      const params = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(params);

      try {
        await s3Client.send(command);
        const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
        images.push(publicUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new ResponseError("Upload Error", 500, "Gagal mengunggah gambar");
      }
    }

    return images;
  }

  static async deleteImageFromR2(imageUrl) {
    const key = this.getKeyFromUrl(imageUrl);
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: key,
    });

    try {
      await s3Client.send(deleteCommand);
      console.log(`Successfully deleted image: ${key}`);
    } catch (error) {
      console.error(`Error deleting image ${key}:`, error);
      throw new ResponseError("Delete Error", 500, "Gagal menghapus gambar");
    }
  }
}

export class SupabaseImageService {
  constructor(bucketName) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    this.bucketName = bucketName;
  }

  static getKeyFromUrl(publicUrl) {
    const publicUrlBase = `${process.env.SUPABASE_PUBLIC_URL}/${this.bucketName}/`;
    return publicUrl.startsWith(publicUrlBase)
      ? publicUrl.slice(publicUrlBase.length)
      : publicUrl;
  }

  async upload(request) {
    if (!request.images || request.images.length < 1) {
      throw new ResponseError(
        "error",
        400,
        "Gambar yang diunggah minimal 1 gambar"
      );
    }

    const filesRequest = await Validation.validate(
      ImageValidation.UPLOAD,
      request
    );

    const images = [];

    for (const file of filesRequest.images) {
      const uniqueFileName = `${uuidv4()}`;
      const filePath = `${request.entity}/${uniqueFileName}`;

      try {
        const { data, error } = await this.supabase.storage
          .from(this.bucketName)
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true
          });
        
        if (error) throw error;

        const data_public_url = this.supabase.storage
          .from(this.bucketName)
          .getPublicUrl(filePath);

        images.push(data_public_url.data);
      } catch (error) {
        throw new ResponseError("Upload Error", 500, "Gagal mengunggah gambar");
      }
    }

    return images;
  }

  async deleteImageFromSupabase(imageUrl) {
    const key = SupabaseImageService.getKeyFromUrl(imageUrl);

    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)        .remove([key]);

      if (error) throw error;

      console.log(`Successfully deleted image: ${key}`);
    } catch (error) {
      console.error(`Error deleting image ${key}:`, error);
      throw new ResponseError("Delete Error", 500, "Gagal menghapus gambar");
    }
  }

  async getFile(folderName, fileName) {
    const fullPath = folderName ? `${folderName}/${fileName}` : fileName;

    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .download(fullPath);

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Error downloading file:", error);
      return {
        success: false,
        message: error.message,
        debug: error.stack,
      };
    }
  }
}
