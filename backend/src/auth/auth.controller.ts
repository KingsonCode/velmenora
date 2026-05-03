import {
  BadRequestException,
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
  createPasswordResetToken,
  createSessionToken,
  getSessionFromCookie,
  hashPassword,
  hashPasswordResetToken,
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

  @Post("forgot-password")
  async forgotPassword(@Body() body: { email?: string }) {
    const email = String(body.email || "").trim().toLowerCase();

    const genericResponse = {
      ok: true,
      message: "If an account exists for this email, reset instructions will be sent.",
    };

    if (!email) {
      return genericResponse;
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return genericResponse;
    }

    const token = createPasswordResetToken();
    const tokenHash = hashPasswordResetToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const resetUrl = `https://velmenora.com/reset-password?token=${encodeURIComponent(token)}`;

    return {
      ...genericResponse,
      resetUrl:
        process.env.PASSWORD_RESET_DEBUG === "true" ? resetUrl : undefined,
    };
  }

  @Post("reset-password")
  async resetPassword(@Body() body: { token?: string; password?: string }) {
    const token = String(body.token || "").trim();
    const password = String(body.password || "");

    if (!token) {
      throw new BadRequestException("Reset token is required");
    }

    if (password.length < 8) {
      throw new BadRequestException("Password must be at least 8 characters");
    }

    const tokenHash = hashPasswordResetToken(token);

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: {
        user: true,
      },
    });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt.getTime() < Date.now() ||
      !resetToken.user ||
      !resetToken.user.isActive
    ) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetToken.userId },
        data: {
          passwordHash: await hashPassword(password),
        },
      });

      await tx.passwordResetToken.update({
        where: { id: resetToken.id },
        data: {
          usedAt: new Date(),
        },
      });

      await tx.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
          id: {
            not: resetToken.id,
          },
        },
        data: {
          usedAt: new Date(),
        },
      });
    });

    return {
      ok: true,
      message: "Password has been reset. You can now sign in.",
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
