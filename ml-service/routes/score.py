import os
import pickle
import traceback
from flask import Blueprint, request, jsonify
from utils.feature_extractor import extract_features

score_bp = Blueprint("score", __name__)

model_path = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "models", "resume_scorer.pkl"
)

model_data = None

try:
    with open(model_path, "rb") as f:
        model_data = pickle.load(f)
    print(f"Model loaded: {model_data['model_name']} | MAE: {model_data['mae']:.2f}")
except FileNotFoundError:
    print("Model not found — run python train/train_model.py first")


@score_bp.route("/score", methods=["POST"])
def score_resume():
    try:
        data = request.get_json()
        print("REQUEST JSON")
        print(request.json)
        if not data:
            return (
                jsonify({"success": False, "message": "request body is required"}),
                400,)

        parsed_resume = data.get("parsedResume")

        if not parsed_resume:
            return (
                jsonify({"success": False, "message": "parsedResume is required"}),
                400,)

        if not model_data:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "model not loaded, run train_model.py first",
                    }
                ),
                500,)
        parsed_resume = data.get("parsedResume")

        print("\nPARSED RESUME RECEIVED")
        print(parsed_resume)
        features = extract_features(parsed_resume)
        

        feature_columns = model_data["feature_columns"]

        feature_vector = [features.get(col, 0) for col in feature_columns]
        model = model_data["model"]
        raw_score = model.predict([feature_vector])[0]
        print("f-v:\n",feature_vector)
        print("raw_s:\n",raw_score)
        
        print("\nFEATURES:")
        print(features)

        print("\nMODEL COLUMNS:")
        print(model_data["feature_columns"])

        print("\nFEATURE VECTOR:")
        print(feature_vector)

        print("\nRAW SCORE:")
        print(raw_score)
        
        print("\nEXTRACTED FEATURES")
        print(features)

        print("\nMODEL FEATURES")
        print(feature_columns)

        missing = [
    col for col in feature_columns
    if col not in features
        ]

        print("\nMISSING FEATURES")
        print(missing)

        ml_score = round(max(0, min(float(raw_score), 100)), 1)

        feedback = generate_feedback(features, ml_score)

        breakdown = get_breakdown(features)

        return jsonify(
            {
                "success": True,
                "mlScore": ml_score,
                "feedback": feedback,
                "breakdown": breakdown,
                "features": features,
                "modelInfo": {
                    "name": model_data["model_name"],
                    "mae": round(model_data["mae"], 2),
                    "r2": round(model_data["r2"], 3),
                },
            }
        )
                 
       
    

    except Exception as e:
      print("========== ERROR ==========")
      traceback.print_exc()
    print("===========================")

    return jsonify({
        "success": False,
        "message": str(e)
    }), 500

def generate_feedback(features, score):

    feedback = []

    # skills feedback
    if features["skills_count"] < 5:
        feedback.append(
            "Add more technical skills — aim for at least 8-10 relevant skills"
        )
    elif features["skills_count"] >= 10:
        feedback.append("Strong skill coverage across multiple domains")

    # frontend
    if features["frontend_skills"] == 0:
        feedback.append("No frontend skills detected — add HTML, CSS, React or similar")

    # backend
    if features["backend_skills"] == 0:
        feedback.append(
            "No backend skills detected — add Node.js, Django, Flask or similar"
        )

    # projects
    if features["project_count"] == 0:
        feedback.append(
            "No projects found — add at least 2-3 projects, critical for freshers"
        )
    elif features["project_count"] < 2:
        feedback.append(
            "Add more projects — 2-3 projects is the minimum for a strong resume"
        )
    else:
        feedback.append(f"Good — {features['project_count']} projects found")

    # deployed projects
    if features["deployed_projects"] == 0:
        feedback.append(
            "Deploy at least one project — live links impress recruiters significantly"
        )
    elif features["deployed_projects"] >= 2:
        feedback.append("Excellent — multiple deployed projects show real-world skills")

    # github
    if not features["has_github"]:
        feedback.append("Add your GitHub profile link — essential for tech roles")

    # linkedin
    if not features["has_linkedin"]:
        feedback.append("Add your LinkedIn profile link")

    if not features["has_portfolio"]:
        feedback.append(
            "Consider adding a portfolio website to showcase projects and achievements"
        )
    # cgpa
    if features["cgpa"] > 0:
        if features["cgpa"] < 6.5:
            feedback.append(
                f"CGPA {features['cgpa']} is below average — compensate with strong projects"
            )
        elif features["cgpa"] >= 8.5:
            feedback.append(
                f"Strong CGPA {features['cgpa']} — highlight it prominently"
            )

    # college tier
    if features["college_score"] >= 7:
        feedback.append(
            "Top tier college — make sure your skills match the expectation"
        )

    # certifications
    if features["certification_count"] == 0 and features["cgpa"] < 7.0:
        feedback.append(
            "Consider adding relevant certifications to compensate for lower CGPA"
        )
    if score >= 85:
        feedback.append("Excellent resume profile")
    elif score >= 70:
        feedback.append("Good resume profile with room for improvement")
    elif score >= 55:
        feedback.append("Average profile — focus on projects and skills")
    else:
        feedback.append("Resume needs significant improvement")

    return feedback


def get_breakdown(features):

    skill_categories = [
        features["frontend_skills"],
        features["backend_skills"],
        features["database_skills"],
        features["cloud_skills"],
        features["ai_skills"],
        features["devops_skills"],
    ]
    # max possible = 4+4+3+2+3+2 = 18
    skills_score = round(min(sum(skill_categories) / 18 * 100, 100))

    project_raw = (
        features["project_count"] * 2
        + features["github_projects"] * 2
        + features["deployed_projects"] * 3
    )
    projects_score = round(min(project_raw / 24 * 100, 100))

    # education score
    edu_raw = (
    features["degree_level"] * 2
    + features["college_score"] * 2
    + max(0, features["cgpa"] - 5) * 2
    )
    education_score = round(min(edu_raw / 24 * 100, 100))

    # experience score
    experience_score = round(min(features["experience_count"] / 3 * 100, 100))

    # online presence score
    presence_raw = (
        features["has_github"] * 3
        + features["has_linkedin"] * 2
        + features["has_portfolio"] * 3
    )
    presence_score = round(min(presence_raw / 8 * 100, 100))

    return {
        "skills": skills_score,
        "projects": projects_score,
        "education": education_score,
        "experience": experience_score,
        "presence": presence_score,
    }
