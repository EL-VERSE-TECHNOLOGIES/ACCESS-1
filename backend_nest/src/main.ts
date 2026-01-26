import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend integration
  app.enableCors({
    origin: '*', // In production, replace with specific frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Use global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 8002;
  await app.listen(port);
  console.log(`EL ACCESS NestJS Backend is running on: http://localhost:${port}`);
}
bootstrap();