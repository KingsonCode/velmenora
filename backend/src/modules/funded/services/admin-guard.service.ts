import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { UserRole } from "../domain/enums";

@Injectable()
export class AdminGuardService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async assertAdminUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundException("admin_user_not_found");
    }

    if (!user.isActive) {
      throw new ForbiddenException({
        ok: false,
        reason: "admin_user_inactive",
      });
    }

    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException({
        ok: false,
        reason: "admin_role_required",
        currentRole: user.role,
      });
    }

    return user;
  }
}
