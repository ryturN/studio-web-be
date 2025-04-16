import { Validation } from "../validation/validation.js";
import { TransactionValidation } from "../validation/transaction-validation.js";
import { prisma } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";

export class TransactionService {
  static async isReservationExist(reservationId) {
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        successAt: null,
        cancelledAt: null,
      },
    });

    if (!reservation) {
      throw new ResponseError("error", 404, "Reservasi tidak ditemukan");
    }

    return reservation;
  }

  static async isTransactionExist(transactionId) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
      },
    });

    if (!transaction) {
      throw new ResponseError("error", 404, "Transaksi tidak ditemukan");
    }

    return transaction;
  }

  static async isReservationOnTransaction(reservationId) {
    const reservation = await prisma.transaction.findFirst({
      where: {
        reservationId: reservationId,
      },
    });

    if (reservation) {
      throw new ResponseError(
        "error",
        400,
        "Reservasi telah terdaftar pada transaksi lain",
      );
    }
  }

  static async isTransactionFinished(transactionId) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        status: "paid",
      },
    });

    if (transaction) {
      throw new ResponseError("error", 400, "Transaksi telah selesai");
    }

    return transaction;
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
      throw new ResponseError(
        "error",
        409,
        "Transaksi tidak dapat diproses, reservasi dibatalkan",
      );
    }
  }

  static async isTransactionDetailExist(transactionDetailId) {
    const transactionDetail = await prisma.transactionDetail.findFirst({
      where: {
        id: transactionDetailId,
      },
    });

    if (!transactionDetail) {
      throw new ResponseError("error", 404, "Detail transaksi tidak ditemukan");
    }

    return transactionDetail;
  }

  static async isTransactionDetailValid(transactionDetailId) {
    const transactionDetail = await prisma.transactionDetail.findFirst({
      where: {
        id: transactionDetailId,
        isValid: true,
      },
    });

    if (transactionDetail) {
      throw new ResponseError("error", 400, "Pembayaran ini sudah divalidasi");
    }

    return transactionDetail;
  }

  static async isTransactionDetailInvalid(transactionDetailId) {
    const transactionDetail = await prisma.transactionDetail.findFirst({
      where: {
        id: transactionDetailId,
        isValid: false,
      },
    });

    if (transactionDetail) {
      throw new ResponseError("error", 400, "Pembayaran ini sudah divalidasi");
    }

    return transactionDetail;
  }

  static async isDetailOnTransaction(transactionId, transactionDetailId) {
    const transactionDetail = await prisma.transactionDetail.findFirst({
      where: {
        id: transactionDetailId,
        transactionId: transactionId,
      },
    });

    if (!transactionDetail) {
      throw new ResponseError(
        "error",
        404,
        "Detail transaksi tidak ditemukan pada transaksi ini",
      );
    }

    return transactionDetail;
  }

  static async isTransactionPaidOff(transactionId) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        status: "paid",
      },
    });

    if (transaction) {
      throw new ResponseError("error", 400, "Transaksi ini telah selesai");
    }

    return transaction;
  }

  static async create(request) {
    const createTransactionRequest = Validation.validate(
      TransactionValidation.CREATE,
      request,
    );

    const reservation = await this.isReservationExist(
      createTransactionRequest.reservationId,
    );
    await this.isReservationOnTransaction(
      createTransactionRequest.reservationId,
    );

    const expired = new Date();
    expired.setMinutes(expired.getMinutes() + 60);

    return prisma.transaction.create({
      data: {
        reservationId: createTransactionRequest.reservationId,
        total: reservation.total,
        type: createTransactionRequest.type,
        expiredAt: expired,
      },
      select: {
        id: true,
        reservationId: true,
        total: true,
        status: true,
        type: true,
        expiredAt: true,
      },
    });
  }

  static async get(transactionId) {
    const getTransactionRequest = Validation.validate(
      TransactionValidation.GET,
      { transactionId },
    );

    const transactionData = await this.isTransactionExist(
      getTransactionRequest.transactionId,
    );

    if (transactionData.expiredAt !== null) {
      if (new Date() > transactionData.expiredAt) {
        await prisma.reservation.update({
          where: {
            id: transactionData.reservationId,
          },
          data: {
            status: "cancelled",
            cancelledAt: new Date(),
          },
        });

        await prisma.transaction.update({
          where: {
            id: transactionData.id,
          },
          data: {
            status: "expired",
            expiredAt: null,
          },
        });
      }
    }

    const transaction = await prisma.transaction.findUnique({
      where: {
        id: getTransactionRequest.transactionId,
      },
      select: {
        id: true,
        total: true,
        status: true,
        type: true,
        expiredAt: true,
        reservation: {
          select: {
            id: true,
            date: true,
            total: true,
            timeSlot: {
              select: {
                time: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            categoryPackage: {
              select: {
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
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
        transaction_detail: {
          select: {
            id: true,
            type: true,
            total: true,
            isValid: true,
            createdAt: true,
            images: {
              select: {
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (transaction.type === "downpayment") {
      transaction.total = transaction.total * 0.5;
    }

    return transaction;
  }

  static async pay(request) {
    const payRequest = Validation.validate(
      TransactionValidation.UPDATE,
      request,
    );

    const transaction = await this.isTransactionExist(payRequest.transactionId);
    await this.isTransactionFinished(payRequest.transactionId);
    await this.isReservationCancelled(transaction.reservationId);

    if (transaction.expiredAt !== null) {
      if (new Date() > transaction.expiredAt) {
        await prisma.reservation.update({
          where: {
            id: transaction.reservationId,
          },
          data: {
            status: "cancelled",
            cancelledAt: new Date(),
          },
        });

        await prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "expired",
            expiredAt: null,
          },
        });

        throw new ResponseError(
          "error",
          400,
          "Transaksi tidak dapat diproses, waktu transaksi telah habis",
        );
      }
    }

    let total_pay = transaction.total;

    if (transaction.type === "downpayment") {
      total_pay = transaction.total * 0.5;
    }

    const transaction_detail = await prisma.transactionDetail.create({
      data: {
        transactionId: payRequest.transactionId,
        total: total_pay,
        type: transaction.type,
      },
      select: {
        id: true,
        transactionId: true,
        total: true,
        type: true,
      },
    });

    await prisma.transaction.update({
      where: {
        id: payRequest.transactionId,
      },
      data: {
        expiredAt: null,
      },
    });

    const image = await prisma.image.create({
      data: {
        imageUrl: payRequest.image,
        entity: "transaction",
        transactionDetailId: transaction_detail.id,
      },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    return {
      ...transaction_detail,
      image,
    };
  }

  static async setValid(request) {
    const setValidRequest = Validation.validate(
      TransactionValidation.SET_VALID,
      request,
    );

    await this.isTransactionExist(setValidRequest.transactionId);
    await this.isDetailOnTransaction(
      setValidRequest.transactionId,
      setValidRequest.transactionDetailId,
    );
    await this.isTransactionDetailExist(setValidRequest.transactionDetailId);
    await this.isTransactionDetailValid(setValidRequest.transactionDetailId);
    await this.isTransactionDetailInvalid(setValidRequest.transactionDetailId);

    return prisma.transactionDetail.update({
      where: {
        id: setValidRequest.transactionDetailId,
      },
      data: {
        isValid: true,
      },
      select: {
        id: true,
        type: true,
        isValid: true,
      },
    });
  }

  static async setInvalid(request) {
    const setInvalidRequest = Validation.validate(
      TransactionValidation.SET_VALID,
      request,
    );

    await this.isTransactionExist(setInvalidRequest.transactionId);
    await this.isDetailOnTransaction(
      setInvalidRequest.transactionId,
      setInvalidRequest.transactionDetailId,
    );
    await this.isTransactionDetailExist(setInvalidRequest.transactionDetailId);
    await this.isTransactionDetailValid(setInvalidRequest.transactionDetailId);
    await this.isTransactionDetailInvalid(
      setInvalidRequest.transactionDetailId,
    );

    return prisma.transactionDetail.update({
      where: {
        id: setInvalidRequest.transactionDetailId,
      },
      data: {
        isValid: false,
      },
      select: {
        id: true,
        type: true,
        isValid: true,
      },
    });
  }

  static async setPaidOff(transactionId) {
    const setPaidOffRequest = Validation.validate(TransactionValidation.GET, {
      transactionId,
    });

    const transaction = await this.isTransactionExist(
      setPaidOffRequest.transactionId,
    );
    await this.isTransactionPaidOff(setPaidOffRequest.transactionId);

    const transactionValid = await prisma.transactionDetail.findMany({
      where: {
        transactionId: setPaidOffRequest.transactionId,
        isValid: true,
      },
    });

    if (transaction.type === "downpayment" && transactionValid.length < 2) {
      throw new ResponseError("error", 400, "Pembayaran belum lunas");
    }

    if (transaction.type === "fullpayment" && transactionValid.length < 1) {
      throw new ResponseError("error", 400, "Pembayaran belum lunas");
    }
    // if(transaction.type === "downpayment" && )

    return prisma.transaction.update({
      where: {
        id: setPaidOffRequest.transactionId,
      },
      data: {
        status: "paid",
      },
      select: {
        id: true,
        status: true,
      },
    });
  }

  static async getTransactionByReservation(reservationId) {
    const getTransactionByReservationRequest = Validation.validate(
      TransactionValidation.GET_BY_RESERVATION,
      { reservationId },
    );

    const transaction = await this.isReservationExist(
      getTransactionByReservationRequest.reservationId,
    );

    if (transaction.expiredAt !== null) {
      if (new Date() > transaction.expiredAt) {
        await prisma.reservation.update({
          where: {
            id: transaction.reservationId,
          },
          data: {
            status: "cancelled",
            cancelledAt: new Date(),
          },
        });

        await prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "expired",
            expiredAt: null,
          },
        });
      }
    }

    return prisma.transaction.findFirst({
      where: {
        reservationId: getTransactionByReservationRequest.reservationId,
      },
      select: {
        id: true,
        reservationId: true,
        total: true,
        status: true,
        type: true,
        expiredAt: true,
      },
    });
  }

  static async fetchAll() {
    return prisma.transaction.findMany({
      select: {
        id: true,
        reservationId: true,
        total: true,
        status: true,
        type: true,
        expiredAt: true,
        reservation: {
          select: {
            id: true,
            date: true,
            total: true,
            timeSlot: {
              select: {
                time: true,
              },
            },
            user: {
              select: {
                name: true,
              },
            },
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
