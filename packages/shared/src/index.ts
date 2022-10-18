import IsNativeToken from './server/api/is-native-token';

export * from './config/index';
export { genAid } from './misc/id/aid';
export { genMeid } from './misc/id/meid';
export { genMeidg } from './misc/id/meidg';
export { genObjectId } from './misc/id/object-id';
export * from './misc/gen-id';



export const isNativeToken = IsNativeToken;
