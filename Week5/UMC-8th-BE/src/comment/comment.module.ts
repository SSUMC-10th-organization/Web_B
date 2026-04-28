import { Module } from "@nestjs/common";
import { PaginationService } from "../common/pagination.service";
import { PrismaService } from "../prisma/prisma.service";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";

@Module({
	controllers: [CommentController],
	providers: [CommentService, PrismaService, PaginationService],
})
export class CommentModule {}
