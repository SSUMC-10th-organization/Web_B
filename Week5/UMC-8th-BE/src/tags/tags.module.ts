import { Module } from "@nestjs/common";
import { PaginationService } from "../common/pagination.service";
import { PrismaService } from "../prisma/prisma.service";
import { TagsController } from "./tags.controller";
import { TagsService } from "./tags.service";

@Module({
	controllers: [TagsController],
	providers: [TagsService, PrismaService, PaginationService],
})
export class TagsModule {}
