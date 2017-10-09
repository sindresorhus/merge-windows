'use strict';

const windowTypes = ['normal', 'popup'];

function p(fn, ...args) {
	return new Promise(resolve => fn(...args, resolve));
}

chrome.browserAction.onClicked.addListener(async () => {
	const [allTabs, currentWindow] = await Promise.all([
		p(chrome.tabs.query, {currentWindow: false}),
		p(chrome.windows.getCurrent)
	]);
	
	const tabs = allTabs.filter(tab => tab.windowType in windowTypes);
	const pinnedTabs = allTabs.filter(tab => tab.pinned);
	
	await p(chrome.tabs.move, tabs.map(tab => tab.id), {
		windowId: currentWindow.id,
		index: -1
	});
	
	for (const pinned of pinnedTabs) {
		chrome.tabs.update(pinned.id, {pinned: true});
	}
});
