import { Validation } from "../validation/validation.js";
import { TimeValidation } from "../validation/time-validation.js";
import { prisma } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";

export class TimeService {
  static async create(request) {
    const createRequest = Validation.validate(TimeValidation.CREATE, request);

    const [hours, minutes] = createRequest.time.split(":").map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);

    const isTimeExist = await prisma.timeSlot.findFirst({
      where: {
        time: {
          equals: date,
        },
        deletedAt: null,
      },
    });

    if (isTimeExist) {
      throw new ResponseError("error", 409, "Waktu sudah ada");
    }

    return prisma.timeSlot.create({
      data: {
        time: date,
      },
      select: {
        id: true,
        time: true,
      },
    });
  }

  static async delete(timeId) {
    const deleteRequest = Validation.validate(TimeValidation.DELETE, {
      timeId,
    });

    const isTimeExist = await prisma.timeSlot.findFirst({
      where: {
        id: deleteRequest.timeId,
      },
    });

    if (!isTimeExist) {
      throw new ResponseError("error", 404, "Waktu tidak ditemukan");
    }

    return prisma.timeSlot.update({
      where: {
        id: deleteRequest.timeId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  static async fetchAll() {
    return prisma.timeSlot.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        time: true,
      },
      orderBy: {
        time: "asc",
      },
    });
  }
}
