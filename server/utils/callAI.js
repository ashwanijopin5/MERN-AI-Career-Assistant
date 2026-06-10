import axios from "axios";

const callAI = async (prompt) => {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/owl-alpha",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.1,
                max_tokens: 800
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );
         console.log("AI RESPONSE:");
console.log(response.data);
        return response.data.choices[0].message.content;

    } catch (error) {
        console.log(
            "OpenRouter Error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export default callAI;