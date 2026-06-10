import callAI from "./callAI.js";
const parseResumeWithAI = async (rawText) => {

  try {

    const prompt = `
Extract information from this resume text.

Return ONLY valid raw JSON.
Do not add markdown.
Do not add explanation.
score must contain only numeric CGPA value.

Examples:

"score":"8.2"

github:
true if GitHub link is present OR project appears to be a software project with source code

deployed:
true if live demo, production URL, Vercel, Netlify, Render, Railway,
AWS, Azure, GCP, Firebase or deployment wording is present

complexity:
1-3 = basic CRUD/project
4-6 = multi-feature project
7-8 = full stack project with authentication, APIs, database
9-10 = production-grade scalable system, AI system, distributed architecture
and adjust these number acoording to u
rate the collage 
10 = IIT Bombay, IIT Delhi, MIT, Stanford
9  = IIT Madras, IIT Kanpur, CMU
8  = Top NITs, BITS Pilani
7  = Good NITs, DTU, NSUT
6  = NIT Kurukshetra, IIITs
5  = Known state universities
3-4 = Average colleges
1-2 = Unknown/low reputation
links:
github = true if GitHub profile link exists
linkedin = true if LinkedIn profile link exists
portfolio = true if portfolio/personal website exists
Resume:
${rawText}

Return structure:
{
  "name": "full name or null",
  "email": "email or null",
  "phone": "phone number or null",
  "skills": ["skill1", "skill2"],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": "",
      "score": "",
      "collegeScore":""
    }
  ],
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "description": ""
    }
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "techStack": [],
      "github": false,
      "deployed": false,
      "complexity": 1-10
    },
  
  ],
   "certifications": [],

  "achievements": [],

  "links": {
    "github": false,
    "linkedin": false,
    "portfolio": false
  }
}
`;

    const response = await callAI(prompt);
    
  
    //console.log("RAW AI RESPONSE:");
    //console.log(response);
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    //console.log("cleaned",cleaned);
    const parsed = JSON.parse(cleaned);
    //console.log("PARSED RESUME:");
    //console.dir(parsed, { depth: null });
    //onsole.log("parsed",parsed)
    return parsed;

  } catch (error) {

    console.log("AI parsing failed:", error);

    return {
      name: null,
      email: null,
      phone: null,
      skills: [],
      education: [],
      experience: [],
      projects: []
    };
  }
};

export default parseResumeWithAI;