document.addEventListener('DOMContentLoaded', function () {

  var actionsContainer = document.getElementById('actions-container');

  // Load saved settings when the page is loaded
  browser.storage.local.get(['actions'], function (data) {
    var actions = data.actions;
    actions.forEach(function (action) {
      addAction(action.name, action.prompt);
    });
  });

    function addAction(name, prompt) {
        var actionDiv = document.createElement('div');
        var nameInput = document.createElement('button');
        nameInput.innerText = name;
        nameInput.classList.add('action-name');
        
        function getHighlightedText() {
            return browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                return browser.tabs.sendMessage(tabs[0].id, {command: "getSelectedText"});
            });
        }

        nameInput.onclick = function() {
            // Get the highlighted text and call rewrite function
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
        // Call your API here and get the response
        var response = await callBackendAPI(original, action);

        // Save the draft in local storage so that it can be accessed in the new popup
        await browser.storage.local.set({draft: response});

        // Open the new popup
        browser.windows.create({url: "/html/draft.html", titlePreface: draftTitle, type: "popup", width: 500, height: 300});
    }


    async function callBackendAPI(original, action) {
        console.log("Calling backend with", action, original);
        const data = await browser.storage.local.get(['model', 'apiKey', 'actions']);
        const model = data.model;
        const apiKey = data.apiKey;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{role: 'user', content: `${action}\n---\n${original}`}]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }else {
            console.log("Got repsonse");
        }

        const responseData = await response.json();
        return responseData.choices[0].message.content;
    }

});
