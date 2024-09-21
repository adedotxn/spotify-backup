import { t } from "elysia";

export const UpsertUserDTO = t.Object({
  username: t.String(),
  accessToken: t.String(),
  refreshToken: t.String(),
  expiresIn: t.Date(),
});
