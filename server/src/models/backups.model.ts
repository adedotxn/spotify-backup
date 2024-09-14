import { t } from "elysia";

export const BackupPlaylistDTO = t.Object({
  spotify_username: t.String(),
});

export const GetBackupsDTO = t.Object({
  spotify_username: t.String(),
});
