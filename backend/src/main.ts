import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { RequestMethod } from "@nestjs/common";
import { json, urlencoded } from "express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.use(
    json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf.toString("utf8");
      },
    }),
  );

  app.use(
    urlencoded({
      extended: true,
      verify: (req: any, _res, buf) => {
        req.rawBody = buf.toString("utf8");
      },
    }),
  );

  app.setGlobalPrefix("api", {
    exclude: [{ path: "admin/payouts", method: RequestMethod.GET }],
  });

  const port = Number(process.env.PORT ?? 8002);
  await app.listen(port, "0.0.0.0");

  console.log(`Backend listening on http://0.0.0.0:${port}/api`);
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap application", error);
  process.exit(1);
});
