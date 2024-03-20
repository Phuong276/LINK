import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomModule } from './custom/custom.module';

@Module({
  imports: [CustomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
