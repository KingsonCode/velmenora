"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const funded_routes_1 = require("./modules/funded/funded.routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/funded", funded_routes_1.fundedRouter);
//# sourceMappingURL=server.js.map