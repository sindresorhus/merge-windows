'use strict';

const windowTypes = ['normal', 'popup'];

function p(fn, ...args) {
	return new Promise(resolve => fn(...args, resolve));
}

chrome.browserAction.onClicked.addListener(async () => {
	const currentWindow = await p(chrome.windows.getCurrent);
	const allTabs = await p(chrome.tabs.query, {currentWindow: false});
	
	const tabs = allTabs.filter(tab => tab.windowType in windowTypes);
	
	await p(chrome.tabs.move, tabs.map(tab => tab.id), {
		windowId: currentWindow.id,
		index: -1
	});
	
	const pinnedTabs = tabs.filter(tab => tab.pinned);
	for (const pinned of pinnedTabs) {
		chrome.tabs.update(pinned.id, {pinned: true});
	}
});
