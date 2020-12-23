const replaceTextNodes = function(node, string, replacement) {
  node.childNodes.forEach(function(el) {
    if (el.nodeType === 3) {
      if (el.nodeValue.trim() !== "") {
        el.nodeValue = el.nodeValue.replace(string, replacement);
      }
    } else {
      replaceTextNodes(el, string, replacement);
    }
  });
}

let body = document.getElementsByTagName('body')[0];
chrome.runtime.sendMessage({ msg: 'paragraph', index: 0 }, function({ strings, replacements, index }){
  chrome.storage.local.get(['swapContentCE'], function (result) {
    let swap = result.swapContentCE;
    if (swap) {
      for (let j = 0; j < strings.length; j++) {
        const regExp = new RegExp(strings[j], 'gi');
        const replacement = replacements[j];
        replaceTextNodes(body, regExp, replacement);
      }
    }
  });
});
