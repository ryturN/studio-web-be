import { prisma } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import { ReviewValidation } from "../validation/review-validation.js";
import { Validation } from "../validation/validation.js";

export class ReviewService {
  static async isReservationExist(reservationId) {
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
      },
    });

    if (!reservation) {
      throw new ResponseError("error", 404, "Reservasi tidak ditemukan");
    }
  }

  static async isReservationByUser(reservationId, userId) {
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        userId: userId,
      },
    });

    console.log(userId);

    if (!reservation) {
      throw new ResponseError("error", 404, "Reservasi bukan milik user");
    }

    return reservation;
  }

  static async isReviewedByUser(reservationId, userId) {
    const review = await prisma.review.findFirst({
      where: {
        reservationId: reservationId,
        userId: userId,
      },
    });

    if (review) {
      throw new ResponseError("error", 400, "Reservasi sudah direview");
    }

    return review;
  }

  static async isNotReviewed(reservationId) {
    const review = await prisma.review.findFirst({
      where: {
        reservationId: reservationId,
      },
    });

    if (!review) {
      throw new ResponseError("error", 400, "Reservasi belum direview");
    }

    return review;
  }

  static async isReservationCancelled(reservationId) {
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        status: "cancelled",
      },
    });

    if (reservation) {
      throw new ResponseError("error", 400, "Reservasi ini dibatalkan");
    }
  }

  static async isReservationSuccess(reservationId) {
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        status: "success",
      },
    });

    if (!reservation) {
      throw new ResponseError("error", 400, "Reservasi ini belum selesai");
    }

    return reservation;
  }

  static async create(request, user) {
    const createRequest = await Validation.validate(
      ReviewValidation.CREATE,
      request,
    );

    await this.isReservationExist(createRequest.reservationId);
    await this.isReservationCancelled(createRequest.reservationId);
    await this.isReservationSuccess(createRequest.reservationId);
    await this.isReservationByUser(createRequest.reservationId, user.id);
    await this.isReviewedByUser(createRequest.reservationId, user.id);

    const review = await prisma.review.create({
      data: {
        reservationId: createRequest.reservationId,
        rating: createRequest.rating,
        review: createRequest.review,
        userId: user.id,
      },
      select: {
        id: true,
        reservationId: true,
        rating: true,
        review: true,
        userId: true,
      },
    });

    return review;
  }

  static async fetchAll() {
    return prisma.review.findMany({
      select: {
        id: true,
        reservationId: true,
        rating: true,
        review: true,
        reservation: {
          select: {
            id: true,
            category: {
              select: {
                name: true,
              },
            },
            categoryPackage: {
              select: {
                name: true,
              },
            },
            total: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async fetchSome() {
    return prisma.review.findMany({
      where: {
        rating: {
          gt: 4,
        },
      },
      select: {
        id: true,
        reservationId: true,
        rating: true,
        review: true,
        reservation: {
          select: {
            id: true,
            category: {
              select: {
                name: true,
              },
            },
            categoryPackage: {
              select: {
                name: true,
              },
            },
            total: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async get(reservationId, user) {
    const getRequest = await Validation.validate(ReviewValidation.GET, {
      reservationId,
    });

    await this.isNotReviewed(getRequest.reservationId);
    await this.isReservationExist(getRequest.reservationId);
    await this.isReservationByUser(getRequest.reservationId, user.id);
    await this.isReservationCancelled(getRequest.reservationId);

    return prisma.review.findFirst({
      where: {
        reservationId: getRequest.reservationId,
      },
      select: {
        id: true,
        reservationId: true,
        rating: true,
        review: true,
        reservation: {
          select: {
            id: true,
            category: {
              select: {
                name: true,
              },
            },
            categoryPackage: {
              select: {
                name: true,
              },
            },
            total: true,
            reservation_detail: {
              select: {
                categoryAddon: {
                  select: {
                    name: true,
                    price: true,
                  },
                },
                quantity: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
