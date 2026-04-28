import {
	type MiddlewareConsumer,
	Module,
	type NestModule,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ResponseInterceptor } from "src/common/interceptors/response.interceptor";
import { LpModule } from "src/lps/lps.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CommentModule } from "./comment/comment.module";
import { LoggerMiddleware } from "./common/logger";
import { LikesModule } from "./likes/likes.module";
import { PrismaModule } from "./prisma/prisma.module";
import { TagsModule } from "./tags/tags.module";
import { UploadsModule } from "./uploads/uploads.module";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [
		PrismaModule,
		UsersModule,
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		LpModule,
		CommentModule,
		LikesModule,
		TagsModule,
		UploadsModule,
	],
	controllers: [AppController],
	providers: [AppService, ResponseInterceptor],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): any {
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
