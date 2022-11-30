import { lang, locale } from "./config";

export default function (scope?: string) {
	const texts = scope ? locale[scope] || {} : {};
	texts["@"] = locale["common"];
	texts["@deck"] = locale["deck"];
	return {
		sync: false,
		locale: lang,
		messages: {
			[lang]: texts,
		},
	};
}

export function i18n(scope?: string) {
	let texts = scope ? locale[scope] || {} : {};
	texts["@"] = locale["common"];
	texts = { ...texts, ...locale["deck"] };
	const t = (path: string) => {
		const split_path = path.split(".");
		if (split_path.length === 0) return texts[`${path}`];
		let data = null;
		for (const _path of split_path) {
			if (data === null) {
				data = texts[`${_path}`];
			} else {
				data = data[`${path}`];
			}
		}
		return data;
	};
	return { t };
}
