import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@ayuskey/nestjs-typeorm';
import { Note } from '../../../../built/models/entities/note';

@Module({
	imports: [TypeOrmModule.forFeature([Note])],
	providers: [NotesService],
	controllers: [NotesController],
})
export class NotesModule {}
