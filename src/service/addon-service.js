import { prisma } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import { Validation } from "../validation/validation.js";
import { AddonValidation } from "../validation/addon-validation.js";

export class AddonService {
  static async check(addonId) {
    const addon = await prisma.categoryAddon.findFirst({
      where: {
        id: addonId,
        deletedAt: null,
      },
    });

    if (!addon) {
      throw new ResponseError("error", 404, "Tambahan tidak ditemukan");
    }

    return addon;
  }

  static async categoryCheck(categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        deletedAt: null,
      },
    });

    if (!category) {
      throw new ResponseError("error", 404, "Kategori tidak ditemukan");
    }

    return category;
  }

  static async create(request) {
    const createRequest = Validation.validate(AddonValidation.CREATE, request);

    await this.categoryCheck(createRequest.categoryId);

    return prisma.categoryAddon.create({
      data: {
        name: createRequest.name,
        unit: createRequest.unit,
        price: createRequest.price,
        categoryId: createRequest.categoryId,
      },
      select: {
        id: true,
        name: true,
        unit: true,
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
    const updateRequest = Validation.validate(AddonValidation.UPDATE, request);
    const addonId = updateRequest.addonId;

    await this.check(addonId);
    await this.categoryCheck(updateRequest.categoryId);

    return prisma.categoryAddon.update({
      where: {
        id: addonId,
      },
      data: {
        name: updateRequest.name,
        unit: updateRequest.unit,
        price: updateRequest.price,
        categoryId: updateRequest.categoryId,
      },
      select: {
        id: true,
        name: true,
        unit: true,
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

  static async get(addonId) {
    await Validation.validate(AddonValidation.GET, { addonId });
    await this.check(addonId);

    return prisma.categoryAddon.findFirst({
      where: {
        id: addonId,
      },
      select: {
        id: true,
        name: true,
        unit: true,
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

  static async delete(addonId) {
    await Validation.validate(AddonValidation.DELETE, { addonId });
    await this.check(addonId);

    return prisma.categoryAddon.update({
      where: {
        id: addonId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  static async fetchAll() {
    return prisma.categoryAddon.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        unit: true,
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

  static async getAddonByCategory(categoryId) {
    const getRequest = Validation.validate(AddonValidation.GET_BY_CATEGORY, {
      categoryId,
    });

    await this.categoryCheck(getRequest.categoryId);

    return prisma.categoryAddon.findMany({
      where: {
        categoryId: getRequest.categoryId,
      },
      select: {
        id: true,
        name: true,
        unit: true,
        price: true,
      },
    });
  }
}
