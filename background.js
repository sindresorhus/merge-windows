'use strict';

const p = (fn, ...args) => new Promise(resolve => fn(...args, resolve));

chrome.browserAction.onClicked.addListener(async () => {
	let [currentWindow, ...tabs] = await Promise.all([
		p(chrome.windows.getCurrent),
		p(chrome.tabs.query, {
			currentWindow: false,
			windowType: 'normal'
		}),
		p(chrome.tabs.query, {
			currentWindow: false,
			windowType: 'popup'
		})
	]);

	tabs = Array.prototype.concat.apply([], tabs);

	await p(chrome.tabs.move, tabs.map(tab => tab.id), {
		windowId: currentWindow.id,
		index: -1
	});

	for (const tab of tabs) {
		if (tab.pinned) {
			chrome.tabs.update(tab.id, {pinned: true});
		}
	}
});
