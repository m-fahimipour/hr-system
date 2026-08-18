import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set Global Prefix
  app.setGlobalPrefix(process.env.API_PREFIX);

  // Cookie
  app.use(cookieParser());

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('HR-System')
    .setDescription('HR-System For Manage Company!!!')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, doc, {
    useGlobalPrefix: true,
    jsonDocumentUrl: 'swagger/json',
  });
  // End of Swagger Config

  await app.listen(process.env.SERVER_PORT ?? 3000);
}
bootstrap();
