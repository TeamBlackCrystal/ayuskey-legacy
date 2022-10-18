import IsNativeToken from './server/api/is-native-token';

export { tryCreateUrl } from './config/index';
export { genAid } from './misc/id/aid';
export { genMeid } from './misc/id/meid';
export { genMeidg } from './misc/id/meidg';
export { genObjectId } from './misc/id/object-id';
export * from './misc/convert-host';
export * from './misc/gen-id';
export * from './misc/secure-rndstr';
export * from './api/common/generate-native-user-token';
export * from './prelude/await-all';



export const isNativeToken = IsNativeToken;
