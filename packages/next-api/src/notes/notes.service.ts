import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@ayuskey/nestjs-typeorm';
import { Repository } from 'typeorm';
import { Instance, Note, User } from '@ayuskey/models';
import { publishNoteStream } from 'src/utils/stream';
import { UserRepository } from 'src/db/repositories/usersRepository';
// import {renderActivity, renderUndo, renderAnnounce, renderDelete, renderTombstone, deliverToFollowers, deliverToRelays} from '../../../../built/remote/activitypub/renderer'
import { UtilsService } from 'src/utils/utils.service';
import { config } from 'src/const';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class NotesService {
	constructor(
		@InjectRepository(Note)
		private noteRepository: Repository<Note>,
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		@InjectRepository(Instance)
		private instanceRepository: Repository<Instance>,
		private utilService: UtilsService,

	) {}

	async getNote(noteId: string) {
		return this.noteRepository.findOne({ where: { id: noteId } });
	}

	async createNote(user: User) {
	}

	async removeNote(user: User, noteId: string, quiet:boolean=false) {
		
		const note = await this.noteRepository.findOne({where: {id: noteId}})

		const deletedAt = new Date();

		await this.noteRepository.delete({
			id: note.id,
			userId: user.id,
		});

		if (note.renoteId) {
			this.noteRepository.decrement({ id: note.renoteId }, 'renoteCount', 1);
			this.noteRepository.decrement({ id: note.renoteId }, 'score', 1);
		}

		// if (quiet === false) {
		// 	publishNoteStream(note.id, 'deleted', {
		// 		deletedAt: deletedAt,
		// 	});

		// 	//#region ローカルの投稿なら削除アクティビティを配送
		// 	if (this.userRepository.isLocalUser(user) && !note.localOnly) {
		// 		let renote: Note | undefined;

		// 		if (note.renoteId && note.text == null && !note.hasPoll && (note.fileIds == null || note.fileIds.length == 0)) {
		// 			renote = await this.noteRepository.findOne({
		// 				id: note.renoteId,
		// 			});
		// 		}

		// 		const content = renderActivity(renote
		// 			? renderUndo(renderAnnounce(renote.uri || `${config.url}/notes/${renote.id}`, note), user)
		// 			: renderDelete(renderTombstone(`${config.url}/notes/${note.id}`), user));

		// 		deliverToFollowers(user, content);
		// 		deliverToRelays(user, content);
		// 	}
		// 	//#endregion

		// 	// 統計を更新
		// 	// notesChart.update(note, false);
		// 	// perUserNotesChart.update(user, note, false);

		// 	if (this.userRepository.isRemoteUser(user)) {
		// 		this.utilService.registerOrFetchInstanceDoc(user.host).then(i => {
		// 			this.instanceRepository.decrement({ id: i.id }, 'notesCount', 1);
		// 			// instanceChart.updateNote(i.host, note, false); TODO: いつか治す
		// 		});
		// 	}
		// }
		// return result.affected === 1 ? true : false
	}

	async getReplies(noteId: string) {

	}
}
