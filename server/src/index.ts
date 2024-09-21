import { Elysia, t } from "elysia";
import { serverTiming } from "@elysiajs/server-timing";
import { userPlugin } from "./modules/user/user.plugin";
import { backupPlugin } from "./modules/backup/backups.plugin";

const app = new Elysia()
  .use(serverTiming())
  .use(userPlugin)
  .use(backupPlugin)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

app.handle(new Request("http://localhost/")).then(console.log);
