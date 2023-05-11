document.addEventListener('DOMContentLoaded', function () {

  var actionsContainer = document.getElementById('actions-container');

  browser.storage.local.get(['actions'], function (data) {
    var actions = data.actions;
    actions.forEach(function (action) {
      addAction(action.name, action.prompt);
    });
  });

    function addAction(name, prompt) {
        var actionDiv = document.createElement('div');
        var nameInput = document.createElement('p');
        nameInput.classList.add('button,');
        nameInput.classList.add('.neutral');
        nameInput.innerText = name;
        nameInput.classList.add('action-name');
        
        function getHighlightedText() {
            return browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                return browser.tabs.sendMessage(tabs[0].id, {command: "getSelectedText"});
            });
        }

        nameInput.onclick = function() {
            getHighlightedText().then(highlightedText => {
                if (highlightedText) {
                    rewrite(highlightedText, prompt, name);
                }
            });
        };
        
        actionDiv.appendChild(nameInput);
        actionsContainer.appendChild(actionDiv);
    }
    async function rewrite(original, action, draftTitle) {
    await browser.storage.local.set({original: original, action: action, draftTitle: draftTitle});

    browser.windows.create({url: "/html/draft.html", type: "popup", width: 500, height: 600});
}

});
