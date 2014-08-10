'use strict';

chrome.browserAction.onClicked.addListener(function () {
	chrome.windows.getCurrent(function (win) {
		chrome.tabs.query({currentWindow: false}, function (tabs) {
			var tabIds = tabs.map(function (el) {
				return el.id;
			});

			chrome.tabs.move(tabIds, {index: -1, windowId: win.id}, function () {
				// preserve pinned tabs
				tabs.forEach(function (el) {
					if (el.pinned) {
						chrome.tabs.update(el.id, {pinned: true});
					}
				});
			});
		});
	});
});
