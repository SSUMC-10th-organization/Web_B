import { Module } from "@nestjs/common";
import { PaginationService } from "src/common/pagination.service";
import { PrismaService } from "src/prisma/prisma.service";
import { LpsController } from "./lps.controller";
import { LpsService } from "./lps.service";

@Module({
	providers: [LpsService, PrismaService, PaginationService],
	controllers: [LpsController],
})
export class LpModule {}
