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
                rewrite(highlightedText, prompt, name);
            }
        });
    };

    actionDiv.appendChild(nameInput);
    actionsContainer.appendChild(actionDiv);
};

const rewrite = async (original, action, draftTitle) => {
    await browser.storage.local.set({ original, action, draftTitle });
    browser.windows.create({ url: "/html/draft.html", type: "popup", width: 512, height: 600 });
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

        actions.forEach((action) => {
            addAction(action.name, action.prompt, actionsContainer);
        });
    });
});
