import { Injectable } from "@nestjs/common";
import { CursorPaginationDto } from "../common/dto/cursor-pagination.dto";
import { PaginationService } from "../common/pagination.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TagsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly pagination: PaginationService,
	) {}

	async findAll(cursorPaginationDto: CursorPaginationDto) {
		return await this.pagination.paginate("tag", "id", {
			...cursorPaginationDto,
		});
	}
}
