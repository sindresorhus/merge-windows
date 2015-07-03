'use strict';

function getTabIds(cb) {
	chrome.tabs.query({
		currentWindow: false,
		windowType: 'normal'
	}, function (tabs) {
		chrome.tabs.query({
			currentWindow: false,
			windowType: 'popup'
		}, function (tabs2) {
			var tabIds = tabs.concat(tabs2).map(function (x) {
				return x.id;
			});

			cb(tabIds);
		});
	});
}

chrome.browserAction.onClicked.addListener(function () {
	getTabIds(function (tabIds) {
		chrome.windows.getCurrent(function (win) {
			chrome.tabs.move(tabIds, {
				windowId: win.id,
				index: -1
			}, function () {
				// preserve pinned tabs
				tabs.forEach(function (x) {
					if (x.pinned) {
						chrome.tabs.update(x.id, {pinned: true});
					}
				});
			});
		});
	});
});
