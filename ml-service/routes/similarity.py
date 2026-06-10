from flask import Blueprint, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from utils.technical_keywords import TECH_KEYWORDS
from utils.text_cleaner import clean_text, extract_keywords
import re
similarity_bp = Blueprint("similarity", __name__)


@similarity_bp.route("/similarity", methods=["POST"])
def compute_similarity():
    try:
        data = request.get_json()

        if not data:
            return (
                jsonify({"success": False, "message": "request body is required"}),
                400,
            )

        resume_text = data.get("resumeText", "")
        job_description = data.get("jobDescription", "")

        if not resume_text or not job_description:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "resumeText and jobDescription are required",
                    }
                ),
                400,
            )

        if len(resume_text.strip()) < 50:
            return (
                jsonify({"success": False, "message": "resume text is too short"}),
                400,
            )

        if len(job_description.strip()) < 50:
            return (
                jsonify({"success": False, "message": "job description is too short"}),
                400,
            )

        cleaned_resume = clean_text(resume_text)
        cleaned_jd = clean_text(job_description)

        vectorizer = TfidfVectorizer(
            max_features=1500,
            ngram_range=(1, 2),
            stop_words="english",
            sublinear_tf=True,
        )

        tfidf_matrix = vectorizer.fit_transform([cleaned_resume, cleaned_jd])

        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

        similarity_score = round(float(similarity) * 100, 1)

        feature_names = vectorizer.get_feature_names_out()

        resume_vector = tfidf_matrix[0].toarray()[0]
        jd_vector = tfidf_matrix[1].toarray()[0]

        common_terms = [
            feature_names[i]
            for i in range(len(feature_names))
            if resume_vector[i] > 0.01 and jd_vector[i] > 0.01
        ]

        common_terms = sorted(common_terms)[:20]

        missing_terms = [
            feature_names[i]
            for i in range(len(feature_names))
            if jd_vector[i] > 0.05 and resume_vector[i] == 0
        ]

        missing_terms = sorted(missing_terms, key=len, reverse=True)[:20]

        resume_keywords = {kw for kw in TECH_KEYWORDS if re.search(rf"\b{re.escape(kw.lower())}\b", cleaned_resume)}
        jd_keywords = {kw for kw in TECH_KEYWORDS if re.search(rf"\b{re.escape(kw.lower())}\b", cleaned_jd)}
        matched_keywords = sorted(list(resume_keywords.intersection(jd_keywords)))

        missing_keywords = sorted(list(jd_keywords.difference(resume_keywords)))
        recommendations = generate_recommendations(missing_keywords)
        ats_score = 0

        if len(jd_keywords) > 0:
            ats_score = round(
                (
                    len(matched_keywords)
                    / max(len(matched_keywords) + len(missing_keywords), 1)
                )
                * 100,
                1,
            )

        final_match_score = round(ats_score * 0.8 +similarity_score * 0.2,1)

        return jsonify(
            {
                "success": True,
                "similarityScore": similarity_score,
                "atsScore": ats_score,
                "finalMatchScore": final_match_score,
                "interpretation": interpret_score(final_match_score),
                "commonTerms": common_terms,
                "missingTerms": missing_terms,
                "keywordAnalysis": {
                    "matched": matched_keywords[:20],
                    "missing": missing_keywords[:20],
                    "matchedCount": len(matched_keywords),
                    "missingCount": len(missing_keywords),
                    "totalJdKeywords": len(jd_keywords),
                },
                "recommendations": recommendations,
            }
        )

    except Exception as e:
        print(f"Similarity route error: {e}")

        return jsonify({"success": False, "message": str(e)}), 500

def generate_recommendations(missing_skills):
    recommendations = []

    skill_map = {
        "javascript": "Add JavaScript explicitly to the Skills section",
        "rest api": "Mention REST API development experience in projects",
        "cloud deployment": "Highlight cloud deployment projects and tools",
        "docker": "Add Docker usage in project descriptions",
        "aws": "Show AWS services used in projects",
        "git": "Mention Git/GitHub workflow experience",
        "mongodb": "Include MongoDB database experience",
        "react": "Highlight React-based projects",
        "redux": "Mention state management using Redux",
        "node.js": "Describe backend APIs built with Node.js",
        "express.js": "Mention Express.js server development",
        "python": "Show Python-based projects",
        "flask": "Mention Flask APIs or applications",
        "machine learning": "Add ML models and deployment details"
    }

    for skill in missing_skills:
        if skill in skill_map:
            recommendations.append(skill_map[skill])

    return recommendations[:5]
def interpret_score(score):

    if score >= 80:
        return {
            "level": "excellent",
            "message": "Excellent match — strong alignment with job requirements",
        }

    elif score >= 65:
        return {
            "level": "strong",
            "message": "Strong match — good chance of passing ATS screening",
        }

    elif score >= 50:
        return {
            "level": "moderate",
            "message": "Moderate match — add missing keywords and skills",
        }

    elif score >= 30:
        return {"level": "weak", "message": "Weak match — significant gaps exist"}

    else:
        return {
            "level": "poor",
            "message": "Poor match — resume needs major improvements",
        }
