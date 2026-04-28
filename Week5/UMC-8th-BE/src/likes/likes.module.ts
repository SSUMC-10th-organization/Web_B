import { Module } from "@nestjs/common";
import { PaginationService } from "../common/pagination.service";
import { PrismaService } from "../prisma/prisma.service";
import { LikesController } from "./likes.controller";
import { LikesService } from "./likes.service";

@Module({
	controllers: [LikesController],
	providers: [LikesService, PrismaService, PaginationService],
})
export class LikesModule {}
