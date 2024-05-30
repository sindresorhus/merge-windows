const browser = globalThis.browser ?? globalThis.chrome;

browser.action.onClicked.addListener(async () => {
	let [currentWindow, ...tabs] = await Promise.all([
		browser.windows.getCurrent(),
		browser.tabs.query({
			currentWindow: false,
			windowType: 'normal',
		}),
		browser.tabs.query({
			currentWindow: false,
			windowType: 'popup',
		}),
	]);

	tabs = tabs.flat();

	await browser.tabs.move(tabs.map(tab => tab.id), {
		windowId: currentWindow.id,
		index: -1,
	});

	for (const tab of tabs) {
		if (tab.pinned) {
			browser.tabs.update(tab.id, {pinned: true});
		}
	}
});
