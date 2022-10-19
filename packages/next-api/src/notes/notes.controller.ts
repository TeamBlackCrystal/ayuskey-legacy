import { Note, User } from '@ayuskey/models';
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth.guard';
import { CurrentUser } from 'src/current-user.decorator';
import { CurrentUserInterceptor } from 'src/current-user.interceptor';
import { CreateNoteDto } from './dto/createNote.dto';
import { GetNoteDto } from './dto/getNote.dto';
import { NotesService } from './notes.service';

@Controller('notes')
@UseInterceptors(CurrentUserInterceptor)
export class NotesController {
	constructor(private notesService: NotesService) {}

	@Get('/:noteId')
	@ApiTags('notes')
	@ApiResponse({status: HttpStatus.OK, type: GetNoteDto})
	@ApiParam({name: 'noteId', type: 'string'})
	async getNotes(@Param('noteId') noteId: string): Promise<IResponse<Note>> {
		const note = await this.notesService.getNote(noteId);
		return {type: 'success', content: note};
	}
	
	@Post()
	@ApiTags('notes')
	@UseGuards(AuthGuard)
	async createNote(@CurrentUser() user: User, @Body() body: CreateNoteDto) {
		console.log(body, user)

	}

	@Delete('/:noteId')
	@ApiTags('notes')
	@UseGuards(AuthGuard)
	async deleteNote(@CurrentUser() user:User, @Param('noteId') noteId: string) {
		const result = await this.notesService.removeNote(user, noteId);
		console.log(result)
		// if (result === false) {
		// 	throw new HttpException({'type': 'error', 'error': {'message': 'nosuch note', 'kind': 'client'}}, HttpStatus.NOT_FOUND)
		// }
	}
}
