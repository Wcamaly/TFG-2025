import { baseBootstrap } from "@core/base-main";

import { ConfigService } from "@nestjs/config";

import * as session from "express-session";
import * as passport from "passport";

import { UsersModule } from "./users.module";

async function bootstrap() {
  const app = await baseBootstrap(UsersModule);
  const configService = app.get(ConfigService);
  app.use(
    session({
      secret: configService.get("PASSPORT_SECRET"),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: configService.get("NODE_ENV"),
        maxAge: 3600000, // optional: 1 hour
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(configService.get("PORT_USERS"));
}

bootstrap();
