import { ImageService, SupabaseImageService } from "../service/image-service.js";

export class ImageController {
  static async upload(req, res, next) {
    try {
      const request = req.body;
      request.images = req.files;
      const response = await ImageService.upload(request);
      // const image_service = new SupabaseImageService('infokus_images')
      // const response = await image_service.upload_file(
      //   '/ca'
      // )

      res.status(201).send({
        status: "success",
        code: 201,
        message: "Gambar berhasil diunggah",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}

export class SupabaseImageController {

  static async upload(req, res, next) {
    try {
      const request = req.body;
      request.images = req.files;
      const image_service = new SupabaseImageService('studios')
      const response = await image_service.upload(request)

      res.status(201).send({
        status: "success",
        code: 201,
        message: "Gambar berhasil diunggah",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}