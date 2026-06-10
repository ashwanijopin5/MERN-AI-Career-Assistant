import callAI from "./callAI.js";

const generateAnswerFeedback = async (questionText, userAnswer) => {
    try {
        const prompt = `You are an expert interviewer reviewing a candidate's answer. Give specific, honest, constructive feedback in 2-3 sentences. Just return the feedback text, nothing else.

Question: ${questionText}
Candidate's Answer: ${userAnswer}`;

        const text = await callAI(prompt);
        return text.trim();

    } catch (error) {
        console.log("Feedback generation failed:", error);
        return "Could not generate feedback, please try again.";
    }
}

export default generateAnswerFeedback