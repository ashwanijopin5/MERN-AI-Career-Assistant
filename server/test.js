import callAI from "./utils/callAI.js";
import dotenv from "dotenv";

dotenv.config();

const test = async () => {
    const response = await callAI(
        "Reply with exactly: OpenRouter Working"
    );

    console.log(response);
};

test();