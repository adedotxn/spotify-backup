import { Elysia, t } from "elysia";
import backupService from "./services/backup.service";
import { BackupPlaylistDTO, GetBackupsDTO } from "./models/backups.model";

export const backupPlugin = new Elysia()
  .post(
    "/backup",
    ({ body: { spotify_username } }) => {
      backupService.backupPlaylists();
    },
    {
      body: BackupPlaylistDTO,
    },
  )
  .get(
    "/backups/:spotify_username",
    ({ params: { spotify_username } }) => {
      backupService.getBackups();
    },
    {
      params: GetBackupsDTO,
    },
  );
