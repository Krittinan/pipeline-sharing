import 'reflect-metadata';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // serialize response ผ่าน *.message.ts (@Expose/@Exclude/@Type)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const corsOrigin = process.env.CORS_ORIGIN;
  app.enableCors({
    origin: !corsOrigin || corsOrigin === '*' ? true : corsOrigin.split(','),
    credentials: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Medium Clone API')
    .setDescription('API สำหรับแพลตฟอร์มบทความสไตล์ Medium')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  const port = Number(process.env.API_PORT) || 3005;
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`🚀 API listening on http://localhost:${port} (docs: /docs)`);
}

void bootstrap();
