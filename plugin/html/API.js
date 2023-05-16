export const fetchModels = async (apiKey) => {
    const response = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
};

export const fetchResponse = async (apiKey, model, original, prompt, maxTokens) => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${apiKey}` 
        },
        body: JSON.stringify({ 
            model, 
            messages: [
                { role: "system", content: prompt },
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
