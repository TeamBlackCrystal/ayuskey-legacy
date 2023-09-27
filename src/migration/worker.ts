import {
	driveFileQueue,
	hashtagQueue,
	instanceQueue,
	noteQueue,
	usedUsernameQueue,
	userAfterHookQueue,
	userQueue,
} from "./jobqueue";

instanceQueue.process("./built/migration/processor/instance.processor.js");
hashtagQueue.process("./built/migration/processor/hashtag.processor.js");
noteQueue.process("./built/migration/processor/note.processor.js");
usedUsernameQueue.process("./built/migration/processor/usedUsername.processor.js");
driveFileQueue.process("./built/migration/processor/driveFile.processor.js");
userQueue.process("./built/migration/processor/user.processor.js");
userAfterHookQueue.process("./built/migration/processor/userAfterHook.processor.js");
