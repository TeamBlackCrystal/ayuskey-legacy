/**
 * ブラウザの検証
 */

// Detect an old browser
if (!('fetch' in window)) {
	alert(
		'お使いのブラウザ(またはOS)のバージョンが旧式のため、Misskeyを動作させることができません。' +
		'バージョンを最新のものに更新するか、別のブラウザをお試しください。' +
		'(Chrome,Vivaldi,新Edge,BraveなどのChromiumのブラウザではしっかりと動作します！)' +
		'\n\n' +
		'Your browser (or your OS) seems outdated. ' +
		'To run Misskey, please update your browser to latest version or try other browsers.');
}
