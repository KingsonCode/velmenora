import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import type { Response } from "express";
import { PrismaService } from "../prisma/prisma.service";
import {
  buildLogoutCookie,
  buildSessionCookie,
  createSessionToken,
  getSessionFromCookie,
  verifyPassword,
} from "./auth-utils";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  @Post("signin")
  async signin(
    @Body() body: { email?: string; password?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (user.passwordHash === "pending_external_auth") {
      throw new UnauthorizedException("Password has not been set for this account");
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.setHeader("Set-Cookie", buildSessionCookie(token));

    return {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.setHeader("Set-Cookie", buildLogoutCookie());

    return { ok: true };
  }

  @Get("me")
  async me(@Headers("cookie") cookieHeader?: string) {
    const session = getSessionFromCookie(cookieHeader);

    if (!session) {
      throw new UnauthorizedException("Unauthorized");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Unauthorized");
    }

    return {
      ok: true,
      user,
    };
  }
}
