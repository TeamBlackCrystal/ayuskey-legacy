import { defaultDeviceSettings } from "../store";
import { TDeviceStore } from "./device";
import { ClientUserDetaield } from "./i";

type TAyuxStore = {
	i: ClientUserDetaield | null,
	device: TDeviceStore
}

const AyuxStorePrefix = 'ayux_';

const AyuxStoreRelation = new Map<keyof TAyuxStore, any>([ // TODO: any直したい
	['i', null],
	['device', defaultDeviceSettings],
]);

export const AYUX = () => {
	const get = <Key extends keyof TAyuxStore, Value extends TAyuxStore[Key]> (key: Key): Value => {
		const item: string = window.localStorage.getItem(`${AyuxStorePrefix}${key}`);
		try {
			return item ? JSON.parse(item) : null;
		} catch (err) {
			 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
			 // @ts-ignore
			return item;
		}
	};
	const del = (key: keyof TAyuxStore): void => {
		window.localStorage.removeItem(key);
	};

	const set = <Key extends keyof TAyuxStore, Value extends TAyuxStore[Key]> (key: Key, value: Value): void => {
		window.localStorage.setItem(`${AyuxStorePrefix}${key}`, JSON.stringify(value));
	};

	const setAllDefault = () => {
		for (const relation of AyuxStoreRelation) {
			if (get(relation[0]) === null) {
				set(relation[0], relation[1]);
			}
		}
	};

	const allClear = (): void => {
		window.localStorage.clear();
	};

	return { get, del, set, allClear, setAllDefault };
};
