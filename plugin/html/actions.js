import { promptVersion } from './globals.js';

const truncate = async (text) => {
    const { maxSize } = await browser.storage.local.get(
        ["maxSize"]);
    const max = parseInt(maxSize, 10);
    if (isNaN(max) || max <= 0) {
        return text;
    }
    const ret = text.substring(0, Math.min(text.length, max));
    return ret;
}
    

const addAction = (name, prompt, actionsContainer) => {
    const actionDiv = document.createElement("div");
    const nameInput = document.createElement("p");
    nameInput.classList.add("flat");
    nameInput.innerText = name;
    nameInput.classList.add("action-name");

    const getHighlight = async () => {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        return {tabId: tabs[0].id, 
            selection: await browser.tabs.sendMessage(tabs[0].id, { command: "getSelectedText" }),
            text: await browser.tabs.sendMessage(tabs[0].id, { command: "getText" })
        };
    };

    nameInput.onclick = async () => {
        const hl = await getHighlight();
        const messages = [{role: "system", content: prompt}];
        if (hl.selection) {
            messages.push({role: "user", content: await truncate(hl.selection)});
        } else {
            messages.push({role: "user", content: await truncate(hl.text)});
        }
        browser.storage.local.set({ messages, draftTitle: name, tabId: hl.tabId }).then( () => {
            browser.windows.create({ url: "/html/draft.html", type: "popup",
                        width: 600, height: 512 });
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
