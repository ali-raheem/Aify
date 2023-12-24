import { promptVersion } from './globals.js';

const addAction = (name, prompt, actionsContainer) => {
    const actionDiv = document.createElement("div");
    const nameInput = document.createElement("p");
    nameInput.classList.add("flat");
    nameInput.innerText = name;
    nameInput.classList.add("action-name");

    const getHighlight = async () => {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        return {tabId: tabs[0].id, text: await browser.tabs.sendMessage(tabs[0].id, { command: "getSelectedText" })};
    };

    nameInput.onclick = async () => {
        const hl = await getHighlight();
        if (hl.text) {
            const messages = [{role: "system", content: prompt},
                    {role: "user", content: hl.text}];
            browser.storage.local.set({ messages, draftTitle: name, tabId: hl.tabId }).then( () => {
                browser.windows.create({ url: "/html/draft.html", type: "popup",
                            width: 600, height: 512 });
            });
        }
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
