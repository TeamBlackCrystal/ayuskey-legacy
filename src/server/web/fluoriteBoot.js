//'use strict'

// eslint-disable-next-line no-unexpected-multiline
(async () => {
	//#region Script
	function importAppScript() {
		import(`/fluorite/${FLUORITE_ENTRY}`)
			.catch(async e => {
				console.error(e);
			});
	}
	// タイミングによっては、この時点でDOMの構築が済んでいる場合とそうでない場合とがある
	if (document.readyState !== 'loading') {
		importAppScript();
	} else {
		window.addEventListener('DOMContentLoaded', () => {
			importAppScript();
		});
	}
	//#endregion
})();
