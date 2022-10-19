import { secureRndstr } from "@/src";

export const generateNativeUserToken = () => secureRndstr(16, true);
