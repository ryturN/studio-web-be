import { Validation } from "../validation/validation.js";
import { ReservationValidation } from "../validation/reservation-validation.js";
import { prisma } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";

export class ReservationService {
  static async isTimeExists(timeId) {
    const isTimeExist = await prisma.timeSlot.findFirst({
      where: {
        id: timeId,
        deletedAt: null,
      },
    });

    if (!isTimeExist) {
      throw new ResponseError("error", 404, "Waktu tidak ditemukan");
    }

    return isTimeExist;
  }

  static async isBooked(timeId, date) {
    const isTimeBooked = await prisma.reservation.findFirst({
      where: {
        date: date,
        timeSlotId: timeId,
        cancelledAt: null,
      },
    });

    if (isTimeBooked) {
      throw new ResponseError("error", 409, "Waktu tidak tersedia");
    }
  }

  static async isAddonExists(addons) {
    const addonIds = addons.map((addon) => addon.id);

    const foundAddons = await prisma.categoryAddon.findMany({
      where: { id: { in: addonIds }, deletedAt: null },
    });

    if (foundAddons.length !== addons.length) {
      throw new ResponseError(
        "error",
        404,
        "Beberapa tambahan tidak ditemukan",
      );
    }
  }

  static async isAddonsExistOnCategory(categoryId, addons) {
    const addonIds = addons.map((addon) => addon.id);

    const validAddons = await prisma.categoryAddon.findMany({
      where: {
        id: { in: addonIds },
        categoryId: categoryId,
        deletedAt: null,
      },
    });

    if (validAddons.length !== addons.length) {
      throw new ResponseError(
        "error",
        404,
        "Beberapa tambahan tidak ada di kategori",
      );
    }
  }

  static async isPackageExists(packageId) {
    const isPackageExist = await prisma.categoryPackage.findFirst({
      where: {
        id: packageId,
        deletedAt: null,
      },
    });

    if (!isPackageExist) {
      throw new ResponseError("error", 404, "Paket tidak ditemukan");
    }

    return isPackageExist;
  }

  static async isCategoryExists(categoryId) {
    const isCategoryExist = await prisma.category.findFirst({
      where: {
        id: categoryId,
        deletedAt: null,
      },
    });

    if (!isCategoryExist) {
      throw new ResponseError("error", 404, "Kategori tidak ditemukan");
    }

    return isCategoryExist;
  }

  static async isPackageExistOnCategory(categoryId, packageId) {
    const isPackageExist = await prisma.categoryPackage.findFirst({
      where: {
        id: packageId,
        categoryId: categoryId,
        deletedAt: null,
      },
    });

    if (!isPackageExist) {
      throw new ResponseError("error", 404, "Paket tidak ada di kategori");
    }
  }

  static async isReservationExists(reservationId) {
    const isReservationExist = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
      },
    });

    if (!isReservationExist) {
      throw new ResponseError("error", 404, "Reservasi tidak ditemukan");
    }
  }

  static async isReservationSuccess(reservationId) {
    const isReservationSuccess = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        status: "success",
        cancelledAt: null,
      },
    });

    if (isReservationSuccess) {
      throw new ResponseError("error", 409, "Reservasi ini sudah selesai");
    }
  }

  static async isReservationCancelled(reservationId) {
    const isReservationCancelled = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        status: "cancelled",
        cancelledAt: { not: null },
      },
    });

    if (isReservationCancelled) {
      throw new ResponseError("error", 409, "Reservasi ini sudah dibatalkan");
    }
  }

  static async isReservationPaidOff(reservationId) {
    const isReservationPaidOff = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        transactions: {
          status: "paid",
        },
      },
    });

    if (!isReservationPaidOff) {
      throw new ResponseError("error", 409, "Reservasi belum dibayar");
    }

    return isReservationPaidOff;
  }

  static validateDuplicateAddons(addons) {
    const addonIds = addons.map((addon) => addon.id);
    const duplicateIds = addonIds.filter(
      (id, index) => addonIds.indexOf(id) !== index,
    );

    if (duplicateIds.length > 0) {
      throw new ResponseError(
        "error",
        400,
        "Tidak boleh ada tambahan yang sama",
      );
    }
  }

  static async create(request, user) {
    request.date = new Date(request.date).toISOString();

    const requestDate = new Date(request.date);
    const utc7Date = new Date(requestDate.getTime() + 7 * 60 * 60 * 1000);
    request.date = utc7Date.toISOString();

    const createRequest = Validation.validate(
      ReservationValidation.CREATE,
      request,
    );

    const now = new Date();
    const utc7Today = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    utc7Today.setHours(0, 0, 0, 0);

    if (new Date(createRequest.date) < utc7Today) {
      throw new ResponseError("error", 400, "Tanggal reservasi tidak valid");
    }

    const timeSlot = await this.isTimeExists(createRequest.timeId);
    await this.isBooked(createRequest.timeId, createRequest.date);
    await this.isCategoryExists(createRequest.categoryId);

    const currentTime = new Date();
    const slotTime = new Date(timeSlot.time);

    if (new Date(createRequest.date) === currentTime && slotTime.getTime() <= currentTime.getTime()) {
      throw new ResponseError("error", 400, "Waktu reservasi tidak valid");
    }

    const packageData = await this.isPackageExists(
      createRequest.categoryPackageId,
    );

    await this.isPackageExistOnCategory(
      createRequest.categoryId,
      createRequest.categoryPackageId,
    );

    let totalPrice = packageData.price;

    let reservationDetails = [];

    if (createRequest.addons && createRequest.addons.length > 0) {
      await this.validateDuplicateAddons(createRequest.addons);
      await this.isAddonExists(createRequest.addons);
      await this.isAddonsExistOnCategory(
        createRequest.categoryId,
        createRequest.addons,
      );

      const addonIds = createRequest.addons.map((addon) => addon.id);
      const addonData = await prisma.categoryAddon.findMany({
        where: { id: { in: addonIds }, deletedAt: null },
      });

      const addonPriceTotal = createRequest.addons.reduce((sum, addon) => {
        const addonInfo = addonData.find((a) => a.id === addon.id);
        if (!addonInfo) {
          throw new ResponseError("error", 404, "Tambahan tidak ditemukan");
        }
        return sum + addonInfo.price * addon.quantity;
      }, 0);

      totalPrice += addonPriceTotal;

      reservationDetails = createRequest.addons.map((addon) => ({
        categoryAddon: { connect: { id: addon.id } },
        quantity: addon.quantity,
      }));
    }

    return prisma.reservation.create({
      data: {
        user: { connect: { id: user.id } },
        date: new Date(createRequest.date),
        total: totalPrice,
        category: { connect: { id: createRequest.categoryId } },
        categoryPackage: { connect: { id: createRequest.categoryPackageId } },
        timeSlot: { connect: { id: createRequest.timeId } },
        ...(reservationDetails.length > 0 && {
          reservation_detail: { create: reservationDetails },
        }),
      },
      select: {
        id: true,
        date: true,
        total: true,
        timeSlot: {
          select: {
            id: true,
            time: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        categoryPackage: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        reservation_detail: {
          select: {
            id: true,
            quantity: true,
            categoryAddon: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  static async setSuccess(reservationId) {
    const setSuccessRequest = Validation.validate(ReservationValidation.GET, {
      reservationId,
    });

    await this.isReservationExists(setSuccessRequest.reservationId);
    await this.isReservationSuccess(setSuccessRequest.reservationId);
    await this.isReservationCancelled(setSuccessRequest.reservationId);
    await this.isReservationPaidOff(setSuccessRequest.reservationId);

    return prisma.reservation.update({
      where: {
        id: setSuccessRequest.reservationId,
      },
      data: {
        status: "success",
        successAt: new Date(),
      },
      select: {
        id: true,
        status: true,
      },
    });
  }

  static async setCancel(reservationId) {
    const setCancelRequest = Validation.validate(ReservationValidation.GET, {
      reservationId,
    });

    await this.isReservationExists(setCancelRequest.reservationId);
    await this.isReservationSuccess(setCancelRequest.reservationId);
    await this.isReservationCancelled(setCancelRequest.reservationId);

    return prisma.reservation.update({
      where: {
        id: setCancelRequest.reservationId,
      },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
      select: {
        id: true,
        status: true,
      },
    });
  }

  static async fetchAll() {
    return prisma.reservation.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        date: true,
        total: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
        timeSlot: {
          select: {
            id: true,
            time: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        categoryPackage: {
          select: {
            id: true,
            name: true,
          },
        },
        reservation_detail: {
          select: {
            id: true,
            quantity: true,
            categoryAddon: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        transactions: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
  }

  static async getReservationByDate(date) {
    const getRequest = Validation.validate(ReservationValidation.GET_BY_DATE, {
      date,
    });

    return prisma.reservation.findMany({
      where: {
        date: getRequest.date,
        cancelledAt: null,
      },
      select: {
        id: true,
        date: true,
        total: true,
        status: true,
        timeSlot: {
          select: {
            id: true,
            time: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        categoryPackage: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        reservation_detail: {
          select: {
            id: true,
            quantity: true,
            categoryAddon: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        transactions: {
          select: {
            status: true,
          },
        },
      },
    });
  }

  static async get(reservationId) {
    const getReservationRequest = Validation.validate(
      ReservationValidation.GET,
      { reservationId },
    );

    await this.isReservationExists(getReservationRequest.reservationId);

    return prisma.reservation.findFirst({
      where: {
        id: getReservationRequest.reservationId,
      },
      select: {
        id: true,
        date: true,
        total: true,
        status: true,
        timeSlot: {
          select: {
            id: true,
            time: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            images: {
              select: {
                imageUrl: true,
              },
            },
          },
        },
        categoryPackage: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        reservation_detail: {
          select: {
            id: true,
            quantity: true,
            categoryAddon: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        transactions: {
          select: {
            id: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        review: {
          select: {
            id: true,
            rating: true,
            review: true,
          },
        },
      },
    });
  }

  static async getReservationByUser(userId) {
    return prisma.reservation.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        date: true,
        total: true,
        status: true,
        timeSlot: {
          select: {
            id: true,
            time: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        categoryPackage: {
          select: {
            id: true,
            name: true,
          },
        },
        reservation_detail: {
          select: {
            id: true,
            quantity: true,
            categoryAddon: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        transactions: {
          select: {
            id: true,
          },
        },
        review: {
          where: {
            userId: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });
  }
}