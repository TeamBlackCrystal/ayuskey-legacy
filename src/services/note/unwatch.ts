import { User, Note } from '@ayuskey/models';
import { NoteWatchings } from '../../models';

export default async (me: User['id'], note: Note) => {
	await NoteWatchings.delete({
		noteId: note.id,
		userId: me,
	});
};
