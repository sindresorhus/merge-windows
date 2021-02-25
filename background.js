'use strict';

const promisify = (fn, ...args) => new Promise(resolve => fn(...args, resolve));

chrome.browserAction.onClicked.addListener(async () => {
	let [currentWindow, ...tabs] = await Promise.all([
		promisify(chrome.windows.getCurrent),
		promisify(chrome.tabs.query, {
			currentWindow: false,
			windowType: 'normal'
		}),
	]);

	tabs = Array.prototype.concat.apply([], tabs);

	await promisify(chrome.tabs.move, tabs.map(tab => tab.id), {
		windowId: currentWindow.id,
		index: -1
	});

	for (const tab of tabs) {
		if (tab.pinned) {
			chrome.tabs.update(tab.id, {pinned: true});
		}
	}
});
