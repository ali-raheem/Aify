browser.runtime.onMessage.addListener((message) => {
  if (message.command === "getSelectedText") {
    return Promise.resolve(window.getSelection().toString());
  } else if (message.command === "replaceSelectedText") {
    const sel = window.getSelection();
    if (!sel || sel.type !== "Range" || !sel.rangeCount) {
      return;
    }
    const r = sel.getRangeAt(0);
    r.deleteContents();
    r.insertNode(document.createTextNode(message.text));
  }
});
