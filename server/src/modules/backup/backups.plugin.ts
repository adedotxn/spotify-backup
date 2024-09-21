import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { BackupPlaylistDTO, GetBackupsDTO } from "./backups.model";

const prisma = new PrismaClient();

export const backupPlugin = new Elysia()
  .post(
    "/backup",
    async ({ body, error }) => {
      const tracks = body.tracks.map((track) => ({
        name: track.name,
        artists: track.artist,
        albumName: track.albumName,
        duration: track.duration,
        explicit: track.explicit,
        trackNumber: track.trackNumber,
        discNumber: track.discNumber,
        uri: track.uri,
        addedAt: track.addedAt,
      }));

      try {
        const data = await prisma.playlist.create({
          data: {
            id: body.playlistId,
            name: body.playlistName,
            user: {
              connect: {
                username: body.username,
              },
            },
            tracks: {
              create: tracks,
            },
          },
        });

        return { data };
      } catch (e) {
        if (e instanceof Error) return error(500, e.message);
        return error(500, e);
      }
    },

    {
      body: BackupPlaylistDTO,
      async beforeHandle({ body, error }) {
        const user = await prisma.user.findUnique({
          where: {
            username: body.username,
          },
        });

        if (!user) {
          return error(404, `User not authenticated or on spotify`);
        }
      },
    },
  )
  .get(
    "/backups/:username",
    ({ params, error }) => {
      try {
        const data = prisma.user.findMany({
          where: {
            username: params.username,
          },
          select: {
            playlists: {
              select: {
                name: true,
                tracks: true,
              },
            },
          },
        });

        return { data };
      } catch (e) {
        if (e instanceof Error) return error(500, e.message);
        return error(500, e);
      }
    },
    {
      params: GetBackupsDTO,
      async beforeHandle({ params, error }) {
        const user = await prisma.user.findUnique({
          where: {
            username: params.username,
          },
        });

        if (!user) {
          return error(404, `User not authenticated or on spotify`);
        }
      },
    },
  );
