import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@ayuskey/nestjs-typeorm';
import { Repository } from 'typeorm';
import { Note } from '../../../../built/models/entities/note';

@Injectable()
export class NotesService {
	constructor(
		@InjectRepository(Note)
		private noteRepository: Repository<Note>,
	) {}

	async getNote(noteId: string) {
		return this.noteRepository.find({ where: { id: noteId } });
	}
}
