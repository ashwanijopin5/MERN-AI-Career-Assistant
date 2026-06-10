AI Career Assistant 🚀

An AI-powered career development platform that helps users analyze resumes, prepare for interviews, and discover relevant job opportunities using Machine Learning and Generative AI.

Features
👤 User Management
User Registration & Login
JWT Authentication
Protected Routes
Profile Management
Resume Upload & Management
📄 Resume Analysis
Upload PDF Resume
AI-Based Resume Parsing
ATS Score Calculation
Skill Extraction
Missing Keywords Detection
Resume Improvement Suggestions
Overall Resume Feedback
🎯 Job Matching
Match resumes with suitable jobs
Skill Gap Identification
Personalized Job Recommendations
Save and Track Jobs
🎤 AI Interview Preparation
Generate interview questions based on resume
Technical & Behavioral Questions
AI Feedback on Answers
Difficulty Levels
Progress Tracking
🤖 Machine Learning Services
Resume Similarity Matching
Resume Scoring
Skill Analysis
NLP-Based Resume Processing
🏢 Job Portal Features
Browse Jobs
Search & Filter Jobs
Apply for Jobs
Recruiter Job Management
Applicant Tracking
Tech Stack
Frontend
React.js
Redux Toolkit
React Router DOM
Tailwind CSS
Axios
Shadcn UI
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Multer
Cloudinary
AI / ML Service
Python
Flask
Scikit-learn
NLTK
NumPy
Pandas
AI Integration
Gemini API
Resume Parsing
ATS Analysis
Interview Question Generation
Answer Evaluation
Project Structure
AI-Career-Assistant
│
├── frontend
│   ├── components
│   ├── redux
│   ├── pages
│   └── hooks
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middlewares
│   └── utils
│
├── ml-service
│   ├── routes
│   ├── models
│   ├── services
│   └── app.py
│
└── README.md
Database Models
User
User
├── fullName
├── email
├── password
├── role
└── profile
Resume
Resume
├── userId
├── title
├── resumeUrl
├── extractedData
└── isActive
Analysis
Analysis
├── userId
├── resumeId
├── atsScore
├── matchedKeywords
├── missingKeywords
├── skillGaps
└── suggestions
InterviewPrep
InterviewPrep
├── userId
├── analysisId
└── questions[]
JobMatch
JobMatch
├── userId
├── analysisId
├── recommendations[]
└── savedJobs[]
Installation
Clone Repository
git clone https://github.com/your-username/AI-Career-Assistant.git
cd AI-Career-Assistant
Backend Setup
cd server
npm install

Create .env

PORT=8000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key

Run Backend

npm run dev
Frontend Setup
cd frontend
npm install

Run Frontend

npm run dev
ML Service Setup

Create virtual environment:

python -m venv venv

Activate:

Windows
venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Run Flask Server:

python app.py
API Endpoints
User
POST   /api/v1/user/register
POST   /api/v1/user/login
GET    /api/v1/user/logout
GET    /api/v1/user/profile
PUT    /api/v1/user/update
Resume
POST   /api/v1/resume/upload
GET    /api/v1/resume/all
GET    /api/v1/resume/:id
DELETE /api/v1/resume/:id
Analysis
POST   /api/v1/analysis/analyze
GET    /api/v1/analysis/all
GET    /api/v1/analysis/:id
Interview
POST   /api/v1/interview/generate
POST   /api/v1/interview/submit-answer
GET    /api/v1/interview/history
Job Match
GET    /api/v1/jobmatch/recommendations
POST   /api/v1/jobmatch/save
GET    /api/v1/jobmatch/stats
Future Enhancements
AI Resume Builder
AI Career Roadmap Generator
Mock Video Interviews
LinkedIn Profile Analysis
Real-Time Job Aggregation
Salary Prediction
Career Gap Analysis
AI Career Coach
Author

Ashwani Jopin

B.Tech Student | MERN Stack Developer | Machine Learning Enthusiast

GitHub: https://github.com/ashwanijopin5
