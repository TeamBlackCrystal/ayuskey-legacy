import { UserKeypair } from '@ayuskey/models';
import { TypeOrmModule } from '@ayuskey/nestjs-typeorm';
import { Module } from '@nestjs/common';
import { RendererService } from './renderer.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserKeypair])],
    providers: [RendererService],
    exports: [RendererService]
})
export class RendererModule {}
