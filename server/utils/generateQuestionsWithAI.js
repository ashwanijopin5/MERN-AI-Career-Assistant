import callAI from "./callAI.js";

 const generateQuestionsWithAI = async (resumeText, jobDescription,jobTitle) => {
     if (!resumeText || !jobDescription) {    
        return null
    }

    try {
        const prompt = `You are an expert technical interviewer. Generate interview questions based on this resume and job description. Return ONLY a JSON array. No explanation, no markdown, just raw JSON.

RESUME:
${resumeText.slice(0, 12000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 8000)}

JOB TITLE: ${jobTitle}

Return exactly 10 questions in this structure:
[
  {
    "questionText": "the interview question",
    "category": "technical or behavioural or project or hr",
    "difficulty": "easy or medium or hard"
  }
]

Strictly follow this distribution:
- 4 technical (DSA, CS fundamentals, based on skills in resume)
- 3 project (based on specific projects mentioned in the resume)
- 2 behavioural (teamwork, challenges, conflict, leadership)
- 1 hr (why this company, tell me about yourself)`

         const rawText = await callAI(prompt);

        const cleanedJson = rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let parsedData
        try {
             parsedData = JSON.parse(cleanedJson)
        } catch (error) {
            throw new Error("Invalid AI JSON response")
        }

        
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
            throw new Error("AI returned empty questions array");
        }

         const safeQuestions = parsedData.filter((q) => (

            q.questionText &&
            q.category &&
            q.difficulty

        ));

        return safeQuestions

    } catch (error) {

        console.log("Question generation failed:", error);

        return []
}}

export default generateQuestionsWithAI;