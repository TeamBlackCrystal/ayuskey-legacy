import { Controller, Get } from '@nestjs/common';

@Controller('notes')
export class NotesController {
	@Get()
	async getNote() {
		return {};
	}
}
