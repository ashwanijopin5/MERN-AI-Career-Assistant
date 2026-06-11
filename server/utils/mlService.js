import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;
 console.log("Calling ML Score API",ML_SERVICE_URL);
export const getMLScore = async (parsedResume) => {
    try {
        const { data } = await axios.post(
            `${ML_SERVICE_URL}/ml/score`,
            { parsedResume }
        );
         console.log("ML Score Response:", data);
        return data;
    } catch (error) {
        console.log("========== ML SCORE ERROR ==========");

    console.log("MESSAGE:", error.message);

    if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);
    }

    console.log("===================================");
        return null;
    }
};

export const getMLSimilarity = async (
    resumeText,
    jobDescription
) => {
    try {
        const { data } = await axios.post(
            `${ML_SERVICE_URL}/ml/similarity`,
            {
                resumeText,
                jobDescription,
            }
        );

        return data;
    } catch (error) {
        console.log(
            "ML Similarity Error:",
            error.message
        );
        return null;
    }
};