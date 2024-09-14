import { Elysia, t } from "elysia";
import { serverTiming } from "@elysiajs/server-timing";
import { backupPlugin } from "./backups.plugin";

const app = new Elysia()
  .use(serverTiming())
  .use(backupPlugin)
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

app.handle(new Request("http://localhost/")).then(console.log);
