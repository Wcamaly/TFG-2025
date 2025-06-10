import { NestModule, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";

import { useContainer } from "class-validator";
import { Logger } from "nestjs-pino";
import { validationPipe } from "@core/pipes/validation.pipe";
import { TransformInterceptor } from "@core/interceptors/transform.interceptor";
import { HttpExceptionFilter } from "@core/filters/http-exception.filter";
import { setSwagger } from "@core/swagger/set-swagger";

export async function baseBootstrap<T extends NestModule>(appModule: Type<T>) {
  
  const app = await NestFactory.create(appModule, {
    bufferLogs: true,
  });
  useContainer(app.select(appModule), { fallbackOnErrors: true });
  app.useGlobalPipes(validationPipe);

  app.enableCors({
    allowedHeaders: "Content-Type, Authorization",
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  const logger = app.get(Logger);
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
  app.useLogger(logger);

  setSwagger(app);

  const configService = app.get(ConfigService);

  const moduleHot = (module as any).hot;
  if (moduleHot && configService.get("NODE_ENV") !== "production") {
    moduleHot.accept();
    moduleHot.dispose(() => app.close());
  }
  return app;
}
