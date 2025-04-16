import { Validation } from "../validation/validation.js";
import { PackageValidation } from "../validation/package-validation.js";
import { prisma } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";

export class PackageService {
  static async check(packageId) {
    const isPackageExist = await prisma.categoryPackage.findFirst({
      where: {
        id: packageId,
        deletedAt: null,
      },
    });

    if (!isPackageExist) {
      throw new ResponseError("error", 404, "Paket tidak ditemukan");
    }
  }

  static async categoryCheck(categoryId) {
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
    const createRequest = Validation.validate(
      PackageValidation.CREATE,
      request,
    );

    await this.categoryCheck(createRequest.categoryId);

    return prisma.categoryPackage.create({
      data: {
        name: createRequest.name,
        description: createRequest.description,
        price: createRequest.price,
        categoryId: createRequest.categoryId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async get(packageId) {
    const getRequest = Validation.validate(PackageValidation.GET, {
      packageId,
    });

    await this.check(getRequest.packageId);

    return prisma.categoryPackage.findUnique({
      where: {
        id: getRequest.packageId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async update(request) {
    const updateRequest = Validation.validate(
      PackageValidation.UPDATE,
      request,
    );

    await this.check(updateRequest.packageId);
    await this.categoryCheck(updateRequest.categoryId);

    return prisma.categoryPackage.update({
      where: {
        id: updateRequest.packageId,
      },
      data: {
        name: updateRequest.name,
        description: updateRequest.description,
        price: updateRequest.price,
        categoryId: updateRequest.categoryId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async delete(packageId) {
    const deleteRequest = Validation.validate(PackageValidation.DELETE, {
      packageId,
    });

    await this.check(deleteRequest.packageId);

    return prisma.categoryPackage.update({
      where: {
        id: deleteRequest.packageId,
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async fetchAll() {
    return prisma.categoryPackage.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
