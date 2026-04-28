import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";
import { storage } from "./utils/file-upload.utils";

@Module({
	imports: [MulterModule.register({ storage })],
	controllers: [UploadsController],
	providers: [UploadsService],
})
export class UploadsModule {}
