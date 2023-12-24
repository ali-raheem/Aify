browser.runtime.onMessage.addListener((message) => {

  const insertNode = (range, text) => {
    const chunks = text.split(/\n{2,}/);
    if (chunks.length == 1) {
      return range.insertNode(document.createTextNode(text));
    }
    const paragraphs = chunks.map((t) => {
      const p = document.createElement("p");
      p.innerText = t;
      return p;
    });
    for (let i = paragraphs.length - 1; i >= 0; i--) {
      range.insertNode(paragraphs[i]);
    }
  };

  if (message.command === "getSelectedText") {
    return Promise.resolve(window.getSelection().toString());
  } else if (message.command === "replaceSelectedText") {
    const sel = window.getSelection();
    if (!sel || sel.type !== "Range" || !sel.rangeCount) {
      return;
    }
    const r = sel.getRangeAt(0);
    r.deleteContents();
    insertNode(r, message.text);
  }
});
