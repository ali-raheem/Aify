import { promptVersion } from './globals.js';

const addAction = (name, prompt, actionsContainer) => {
    const actionDiv = document.createElement("div");
    const nameInput = document.createElement("p");
    nameInput.classList.add("flat");
    nameInput.innerText = name;
    nameInput.classList.add("action-name");

    const getHighlightedText = () => {
        return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            return browser.tabs.sendMessage(tabs[0].id, { command: "getSelectedText" });
        });
    };

    nameInput.onclick = () => {
        getHighlightedText().then((highlightedText) => {
            if (highlightedText) {
		const messages = [{role: "system", content: prompt},
				  {role: "user", content: highlightedText}];
		browser.storage.local.set({ messages, draftTitle: name }).then( () => {
		    browser.windows.create({ url: "/html/draft.html", type: "popup",
					     width: 600, height: 512 });
		});
            }
        });
    };
    actionDiv.appendChild(nameInput);
    actionsContainer.appendChild(actionDiv);
};

document.addEventListener("DOMContentLoaded", () => {
    const actionsContainer = document.getElementById("actions-container");
    browser.storage.local.get(["actions", "promptUpdated"], (data) => {
        const { actions, promptUpdated = 0 } = data;
        if (promptVersion > promptUpdated) {
            const warningIcon = document.createElement('img');
            warningIcon.src = "/images/warning.png";
            warningIcon.classList.add('small-icon');
            const settingsLink = document.getElementById('settings-link');
            settingsLink.appendChild(warningIcon);
        };
        actions.forEach((action) => {addAction(action.name, action.prompt, actionsContainer)});
    });
});
