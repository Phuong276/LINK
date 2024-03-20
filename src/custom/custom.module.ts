import { Module } from '@nestjs/common';
import { CustomController } from './custom.controller';
import { CustomService } from './custom.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CustomController],
  providers: [CustomService],
  exports: [CustomService],
})
export class CustomModule {}
