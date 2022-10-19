import { secureRndstr } from "../../misc/secure-rndstr";

export const generateNativeUserToken = () => secureRndstr(16, true);
