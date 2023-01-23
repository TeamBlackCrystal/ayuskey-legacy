import { useDeviceStore } from './device';
import { useIStore } from './i';
import { useSettingsStore } from './settings';

export const useStore = () => {
	return {
		i: useIStore(),
		device: useDeviceStore(),
		settings: useSettingsStore(),
	};
};
