async function regenerate(draftContainer, original, action, draftTitle) {
    const loadingIcon = document.createElement("img");
    loadingIcon.src = "/images/loading.png";
    loadingIcon.classList.add("rotate");

    draftContainer.textContent = "";
    draftContainer.appendChild(loadingIcon);

    try {
        const draft = await callBackendAPI(original, action);
        draftContainer.textContent = draft;
        document.title = draftTitle;
    } catch (error) {
        console.error(error);
        draftContainer.textContent = "Error: Unable to retrieve data";
    }
}

async function callBackendAPI(original, action) {
    const { model, apiKey, maxTokens } = await browser.storage.local.get(["model", "apiKey", "maxTokens"]);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${apiKey}` 
        },
        body: JSON.stringify({ 
            model, 
            messages: [
                { role: "system", content: action },
                { role: "user", content: original }
            ], 
            ...(maxTokens > 0 ? { 'max_tokens': parseInt(maxTokens) } : {})
        }),
    });

    if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`API request failed: ${response.status}, Detail: ${errorDetail}`);
    }
    

    const responseData = await response.json();
    return responseData.choices[0].message.content;
}

document.addEventListener("DOMContentLoaded", async () => {
    const regenButton = document.getElementById('regenerate');
    const draftContainer = document.getElementById("draft-container");

    const { original, action, draftTitle } = await browser.storage.local.get(["original", "action", "draftTitle"]);

    await browser.storage.local.set({ original: "", action: "", draftTitle: "" });

    regenButton.addEventListener("click", () => regenerate(draftContainer, original, action, draftTitle));
    regenerate(draftContainer, original, action, draftTitle);
});
