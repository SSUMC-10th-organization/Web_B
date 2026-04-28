import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import googleOauthConfig from "src/auth/config/google-oauth-config";
import jwtConfig from "src/auth/config/jwt.config";
import refreshConfig from "src/auth/config/refresh.config";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth/jwt-auth.guard";
import { GoogleStrategy } from "src/auth/strategies/google.strategy";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";
import { LocalStrategy } from "src/auth/strategies/local.strategy";
import { RefreshStrategy } from "src/auth/strategies/refresh-token.strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		JwtModule.registerAsync(jwtConfig.asProvider()),
		ConfigModule.forFeature(jwtConfig),
		ConfigModule.forFeature(refreshConfig),
		ConfigModule.forFeature(googleOauthConfig),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		UserService,
		PrismaService,
		LocalStrategy,
		JwtStrategy,
		RefreshStrategy,
		GoogleStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AuthModule {}
