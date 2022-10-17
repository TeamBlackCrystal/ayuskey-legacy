import { DriveFile } from '@ayuskey/models';
import { DriveFiles } from '../../../models';

export default (file: DriveFile) => ({
	type: 'Document',
	mediaType: file.type,
	url: DriveFiles.getPublicUrl(file),
	name: file.comment,
});
