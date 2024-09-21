import { PrismaClient } from "@prisma/client";
import { Elysia, t } from "elysia";
import { UpsertUserDTO } from "./user.model";

const prisma = new PrismaClient();

export const userPlugin = new Elysia().post(
  "/",
  async ({ body, error }) => {
    try {
      const user = await prisma.user.upsert({
        where: {
          username: body.username,
        },
        update: {
          verification: {
            update: {
              accessToken: body.accessToken,
              refreshToken: body.refreshToken,
              expiresIn: body.expiresIn,
            },
          },
        },
        create: {
          username: body.username,
          verification: {
            create: {
              accessToken: body.accessToken,
              refreshToken: body.refreshToken,
              expiresIn: body.expiresIn,
            },
          },
        },
        include: {
          verification: true,
        },
      });

      return { message: "User upserted", data: user };
    } catch (e) {
      return error(500);
    }
  },
  {
    body: UpsertUserDTO,
  },
);
