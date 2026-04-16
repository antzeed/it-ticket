import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    TicketsModule, 
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
