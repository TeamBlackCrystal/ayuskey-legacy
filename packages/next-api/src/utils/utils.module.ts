import { Instance } from '@ayuskey/models';
import { TypeOrmModule } from '@ayuskey/nestjs-typeorm';
import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([Instance])],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
