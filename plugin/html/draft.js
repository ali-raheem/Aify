async function regenerate (draftContainer, original, action, draftTitle) {
    var loadingIcon = document.createElement("img");
    loadingIcon.src = "/images/loading.png"
    loadingIcon.classList.add("rotate");
    draftContainer.innerText = "";
    draftContainer.appendChild(loadingIcon);
    try {
        const draft = await callBackendAPI(original, action);
        draftContainer.innerText = draft;
        document.title = draftTitle;
    } catch (error) {
        console.error(error);
        draftContainer.innerText = "Error: Unable to retrieve data";
    }
}
document.addEventListener("DOMContentLoaded", async function () {
    let regenButton = document.getElementById('regenerate');
    const draftContainer = document.getElementById("draft-container");
    const data = await browser.storage.local.get(["original", "action", "draftTitle"]);
    browser.storage.local.set({original: "", action: "", draftTitle: ""});
    const original = data.original;
    const action = data.action;
    const draftTitle = data.draftTitle;
    regenButton.addEventListener("click", function() {
        regenerate(draftContainer, original, action, draftTitle)
    });
    regenerate(draftContainer, original, action, draftTitle)
});

async function callBackendAPI(original, action) {
    const data = await browser.storage.local.get(["model", "apiKey", "maxTokens"]);
    const model = data.model;
    const apiKey = data.apiKey;
    const maxTokens = parseInt(data.maxTokens);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
	body: JSON.stringify({ 
	    model: model, 
	    messages: [{ role: "user", content: `${action}\n---\n${original}` }], 
	    ...(maxTokens ? { 'max_tokens': maxTokens } : {})
	}),
    });
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData.choices[0].message.content;
}
