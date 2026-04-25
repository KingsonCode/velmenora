"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundedRouter = void 0;
const express_1 = require("express");
const ChallengeLifecycleService_1 = require("./ChallengeLifecycleService");
exports.fundedRouter = (0, express_1.Router)();
const lifecycle = new ChallengeLifecycleService_1.ChallengeLifecycleService();
exports.fundedRouter.post("/apply", async (req, res) => {
    try {
        const result = await lifecycle.apply({
            email: req.body.email,
            fullName: req.body.fullName,
            phone: req.body.phone,
            planSlug: req.body.planSlug,
        });
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(400).json({
            ok: false,
            error: error instanceof Error ? error.message : "Failed to apply",
        });
    }
});
//# sourceMappingURL=funded.routes.js.map