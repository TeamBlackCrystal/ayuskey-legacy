import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@ayuskey/nestjs-typeorm';
import { Instance, Note, User } from '@ayuskey/models';
import { UtilsService } from 'src/utils/utils.service';
import { UserRepository } from 'src/db/repositories/usersRepository';

@Module({
	imports: [TypeOrmModule.forFeature([Note, User, Instance, UserRepository])],
	providers: [NotesService, UtilsService],
	controllers: [NotesController],
})
export class NotesModule {}
