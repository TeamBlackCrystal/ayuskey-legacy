import { DriveFile } from '@ayuskey/models';
import { DriveFiles } from '../../../models';

export default (file: DriveFile) => ({
	type: 'Image',
	url: DriveFiles.getPublicUrl(file),
	sensitive: file.isSensitive,
	name: file.comment,
});
