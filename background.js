'use strict';

const log = function(...args) {
    console.log(...args);
    chrome.extension.getBackgroundPage().console.log(...args);
};

function changeImageUrls(details) {
    if(details.url.includes('.svg') === false){
        let width = 600;
        let height = 400
        const params = getParams(details.url);

        if(typeof params != "undefined") {
            height = typeof params.w != "undefined" ? params.w : height;
            width = typeof params.w != "undefined" ? params.w : width;
        }
        
        return { redirectUrl:`https://picsum.photos/${width}/${height}` };
    }
}

function doNotChangeImageUrls(details) {
    //
}

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
const getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

chrome.webRequest.onBeforeRequest.addListener(
    changeImageUrls,
    arrayOfUrls,
    ['blocking']
);

chrome.runtime.onMessage.addListener(function(message, sender, senderResponse){
    if (message.msg === "paragraph") {
        senderResponse({ strings: strings, replacements: replacements, index: message.index });
    }
    if (message.msg === "swap") {
        chrome.webRequest.onBeforeRequest.removeListener(changeImageUrls);
        chrome.webRequest.onBeforeRequest.addListener(
            doNotChangeImageUrls,
            arrayOfUrls,
            ["blocking"]
        );
        chrome.webRequest.handlerBehaviorChanged();
        senderResponse({ response: 'ok' });
    } else if (message.msg === "noswap") {
        chrome.webRequest.onBeforeRequest.removeListener(doNotChangeImageUrls);
        chrome.webRequest.onBeforeRequest.addListener(
            changeImageUrls,
            arrayOfUrls,
            ["blocking"]
        );
        chrome.webRequest.handlerBehaviorChanged();
        senderResponse({ response: 'ok' });
    }
    return true;  // Will respond asynchronously.
});

