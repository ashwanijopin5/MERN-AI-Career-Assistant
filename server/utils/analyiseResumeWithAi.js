import callAI from "./callAI.js";



const analyzeResumeATS = async (resumeText, jobDescription) => {
     if (!resumeText || !jobDescription) {    
        return null
    }

    try {
        const trimmedResume = resumeText.slice(0, 12000);
        const trimmedJD = jobDescription.slice(0, 8000);

        const prompt = `You are an expert ATS resume analyzer. Analyze this resume against the job description and return ONLY a JSON object. No explanation, no markdown, just raw JSON.

RESUME:
${trimmedResume}

JOB DESCRIPTION:
${trimmedJD}

Return this exact structure:
{
  "atsScore": <number 0-100 based on how well resume matches JD>,
  "matchedKeywords": ["keywords found in both resume and JD"],
  "missingKeywords": ["important keywords in JD but missing from resume"],
  "skillGaps": [
    {
      "skill": "skill name",
      "importance": "high or medium or low"
       
    }
],
  "suggestions": [
    "specific actionable suggestion to improve resume for this JD",
    "another suggestion"
  ],
  "overallFeedback": "2-3 sentence overall assessment of how well this resume matches the job"
}`;

         const response = await callAI(prompt);

        const rawText = response;

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

        
       

        return {
            atsScore: Number(parsedData?.atsScore) || 0,
            matchedKeywords: parsedData?.matchedKeywords || [],
            missingKeywords: parsedData?.missingKeywords || [],
            skillGaps: parsedData?.skillGaps || [],
            suggestions: parsedData?.suggestions || [],
            overallFeedback:
                parsedData?.overallFeedback ||
                "AI analysis unavailable"
        }

    } catch (error) {

        console.log("AI parsing failed:", error);

        return {
          atsScore: 0,
    matchedKeywords: [],
    missingKeywords: [],
    skillGaps: [],
    suggestions: [],
    overallFeedback: "AI analysis failed"
        };
    }
};

export default analyzeResumeATS;