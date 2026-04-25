"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("api");
    const port = Number(process.env.PORT ?? 8002);
    await app.listen(port, "0.0.0.0");
    console.log(`Backend listening on http://0.0.0.0:${port}/api`);
}
bootstrap().catch((error) => {
    console.error("Failed to bootstrap application", error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map