import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService],
})
export class UsersModule {}
