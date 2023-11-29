(function () {

  const makeParagraphs = (text, func) => {
    console.log('ins', text);
    const chunks = text.split(/\n{2,}/);
    if (chunks.length == 1) {
      return func(document.createTextNode(text));
    }
    const paragraphs = chunks.map((t) => {
      const p = document.createElement("p");
      p.innerText = t;
      return p;
    });
    for (let i = paragraphs.length - 1; i >= 0; i--) {
      func(paragraphs[i]);
    }
  };

  const insert = function (text) {
    const prefix = window.document.body.getElementsByClassName("moz-cite-prefix");
    if (prefix.length >= 0) {
      console.log("found prefix");
      const divider = prefix[0];
      let sibling = divider.previousSibling;
      while (sibling) {
        window.document.body.removeChild(sibling);
        sibling = sibling.sibling;
      }
      console.log('after removal', window.document.body.innerHTML);
    }
    return makeParagraphs(text, function (p) {
      window.document.body.insertBefore(p, window.document.body.firstChild);
    });
  }

  browser.runtime.onMessage.addListener((message) => {

    if (message.command === "getSelectedText") {
      return Promise.resolve(window.getSelection().toString());
    } else if (message.command === "replaceSelectedText") {
      console.log('replacing with', message.text);
      const selectedText = window.getSelection().toString();
      console.log('current selection', selectedText);
      if (!selectedText) {
        return insert(message.text);
      }
      const sel = window.getSelection();
      if (!sel || sel.type !== "Range" || !sel.rangeCount) {
        return;
      }
      const r = sel.getRangeAt(0);
      r.deleteContents();
      makeParagraphs(message.text, function (p) {
        r.insertNode(p);
      });
    } else if (message.command === "getText") {
      return Promise.resolve(window.document.body.textContent);
    }
  });
})();