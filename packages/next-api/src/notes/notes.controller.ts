import { Controller, Get, Param } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
	constructor(private notesService: NotesService) {}

	@Get('/:noteId')
	async getNotes(@Param('noteId') noteId: string) {
		await this.notesService.getNote(noteId);
		return {};
	}
}
