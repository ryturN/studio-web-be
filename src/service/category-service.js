import { Validation } from "../validation/validation.js";
import { CategoryValidation } from "../validation/category-validation.js";
import { prisma } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import { ImageService } from "./image-service.js";

export class CategoryService {
  static async check(categoryId) {
    const isCategoryExist = await prisma.category.findFirst({
      where: {
        id: categoryId,
        deletedAt: null,
      },
    });

    if (!isCategoryExist) {
      throw new ResponseError("error", 404, "Kategori tidak ditemukan");
    }
  }

  static async create(request) {
    console.log(request)
    const createRequest = Validation.validate(
      CategoryValidation.CREATE,
      request,
    );


    const category = await prisma.category.create({
      data: {
        name: createRequest.name,
        deskripsi: createRequest.deskripsi,
      },
      select: {
        id: true,
        name: true,
        deskripsi: true
      },
    });

    const images = await prisma.image.createMany({
      data: createRequest.images.map((image) => ({
        imageUrl: image,
        entity: "category",
        categoryId: category.id,
      })),
    });

    return {
      ...category,
      images,
    };
  }

  static async get(categoryId) {
    await Validation.validate(CategoryValidation.GET, { categoryId });
    await this.check(categoryId);

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        deskripsi: true,
        images: {
          select: {
            imageUrl: true,
          },
        },
        category_packages: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
        category_addons: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    category.images = category.images.map((image) => image.imageUrl);

    return category;
  }

  static async update(request) {
    const updateRequest = Validation.validate(
      CategoryValidation.UPDATE,
      request,
    );

    await this.check(updateRequest.categoryId);

    const currentImages = await prisma.image.findMany({
      where: {
        categoryId: request.categoryId,
      },
      select: {
        imageUrl: true,
      },
    });

    const imagesToDelete = currentImages.filter(
      (img) => !updateRequest.images.includes(img.imageUrl),
    );

    for (const image of imagesToDelete) {
      await ImageService.deleteImageFromR2(image.imageUrl);
    }

    const category = await prisma.category.update({
      where: {
        id: request.categoryId,
      },
      data: {
        name: request.name,
        deskripsi: request.deskripsi,
      },
      select: {
        id: true,
        name: true,
      },
    });

    await prisma.image.deleteMany({
      where: {
        categoryId: request.categoryId,
      },
    });

    const newImages = await prisma.image.createMany({
      data: updateRequest.images.map((image) => ({
        imageUrl: image,
        entity: "category",
        categoryId: category.id,
      })),
    });

    return {
      ...category,
      images: newImages,
    };
  }

  static async delete(categoryId) {
    await Validation.validate(CategoryValidation.DELETE, { categoryId });
    await this.check(categoryId);

    const images = await prisma.image.findMany({
      where: {
        categoryId: categoryId,
      },
      select: {
        imageUrl: true,
      },
    });

    for (const image of images) {
      await ImageService.deleteImageFromR2(image.imageUrl);
    }

    const deletedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
      },
    });

    await prisma.image.deleteMany({
      where: {
        categoryId: categoryId,
      },
    });

    return deletedCategory;
  }

  static async fetchAll() {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        deskripsi: true,
        images: {
          select: {
            imageUrl: true,
          },
        },
        category_packages: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            price: "asc",
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
        category_addons: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return categories.map((category) => ({
      ...category,
      images: category.images.map((image) => image.imageUrl),
    }));
  }

  static async getLatest() {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        deskripsi: true,
        images: {
          select: {
            imageUrl: true,
          },
        },
        category_packages: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            price: "asc",
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });

    return categories.map((category) => ({
      ...category,
      images: category.images.map((image) => image.imageUrl),
    }));
  }
}
