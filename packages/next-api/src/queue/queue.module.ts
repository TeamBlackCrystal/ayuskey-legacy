import { TypeOrmModule } from '@ayuskey/nestjs-typeorm';
import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { config } from 'src/const';
import { QueueService } from './queue.service';

@Module({
  imports: [

  ],
  providers: [QueueService],
  exports: [QueueService]
})
export class QueueModule {}
