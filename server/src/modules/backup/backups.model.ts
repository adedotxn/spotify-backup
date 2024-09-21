import { t } from "elysia";

export const BackupPlaylistDTO = t.Object({
  username: t.String(),
  playlistId: t.String(),
  playlistName: t.String(),
  tracks: t.Array(
    t.Object({
      name: t.String(),
      artist: t.String(),
      albumName: t.String(),
      duration: t.Integer(),
      explicit: t.Boolean(),
      trackNumber: t.Integer(),
      discNumber: t.Integer(),
      uri: t.String(),
      addedAt: t.String(),
    }),
  ),
});

export const GetBackupsDTO = t.Object({
  username: t.String(),
});
