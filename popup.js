'use strict';

const log = function(...args) {
    console.log(...args);
    chrome.extension.getBackgroundPage().console.log(...args);
};

let swapBtn = document.getElementById('swapContent');

swapBtn.onclick = function(element) {
    chrome.storage.local.get(['swapContentCE'], function (result) {
        let swap = result.swapContentCE;
        chrome.storage.local.set({ 'swapContentCE': !swap });
        chrome.runtime.sendMessage({ msg: swap ? 'swap' : 'noswap', index: 0 }, function({ response }){
            if (response) {
                chrome.tabs.getSelected(null, function(tab) {
                    let code = 'window.location.reload();';
                    chrome.tabs.executeScript(tab.id, { code: code });
                });
            }
        });
    });
};
