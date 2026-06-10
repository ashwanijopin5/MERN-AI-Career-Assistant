import re

FRONTEND_SKILLS = {
    "react",
    "redux",
    "next.js",
    "next",
    "vue",
    "angular",
    "html",
    "css",
    "tailwind",
    "bootstrap",
    "typescript",
    "javascript",
}


BACKEND_SKILLS = {"node.js", "node", "express", "django", "flask", "fastapi", "spring"}


AI_SKILLS = {
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "nlp",
    "opencv",
    "scikit-learn",
    "scikit",
    "pandas",
    "numpy",
    "data science",
    "computer vision",
}

DATABASE_SKILLS = {"mongodb", "mysql", "postgresql", "redis", "sqlite"}

CLOUD_SKILLS = {"aws", "azure", "gcp", "firebase"}


DEVOPS_SKILLS = {"docker", "kubernetes", "jenkins", "linux"}


def get_degree_level(degree):

    if not degree:
        return 0

    degree = degree.lower()

    if "phd" in degree:
        return 4

    if "m.tech" in degree or "master" in degree:
        return 3

    if "b.tech" in degree or "bachelor" in degree:
        return 2

    if "diploma" in degree:
        return 1

    return 0




def count_matching_skills(skills, category):
    skills_lower = {skill.lower() for skill in skills}

    return len(skills_lower.intersection(category))


def extract_features(parsed_resume):

    if not parsed_resume:
        return _empty_features()

   
    education = parsed_resume.get("education", {})

    if isinstance(education, list):
     education = education[0] if education else {}
    skills = parsed_resume.get("skills", [])

    projects = parsed_resume.get("projects", [])

    experience = parsed_resume.get("experience", [])

    certifications = parsed_resume.get("certifications", [])

    achievements = parsed_resume.get("achievements", [])

    links = parsed_resume.get("links", {})
    college_score = int(education.get("collegeScore", 0))
    project_count = len(projects)
    project_complexities = [p.get("complexity", 0) for p in projects]

    avg_project_complexity = (
        sum(project_complexities) / len(project_complexities)
        if project_complexities
        else 0
    )

    github_projects = sum(1 for p in projects if p.get("github"))

    deployed_projects = sum(1 for p in projects if p.get("deployed"))

    return {
        "skills_count": len(skills),
        "frontend_skills": count_matching_skills(skills, FRONTEND_SKILLS),
        "backend_skills": count_matching_skills(skills, BACKEND_SKILLS),
        "database_skills": count_matching_skills(skills, DATABASE_SKILLS),
        "cloud_skills": count_matching_skills(skills, CLOUD_SKILLS),
        "ai_skills": count_matching_skills(skills, AI_SKILLS),
        "devops_skills": count_matching_skills(skills, DEVOPS_SKILLS),
        "project_count": project_count,
        "github_projects": github_projects,
        "deployed_projects": deployed_projects,
        "experience_count": len(experience),
        "has_education": int(bool(education)),
        "college_score": college_score,
        "degree_level": get_degree_level(education.get("degree", "")),
        
        "cgpa": float(education.get("score", 0) or 0),
        "certification_count": len(certifications),
        "achievement_count": len(achievements),
        "avg_project_complexity": round(avg_project_complexity, 2),
        "has_github": int(links.get("github", False)),
        "has_linkedin": int(links.get("linkedin", False)),
        "has_portfolio": int(links.get("portfolio", False)),
    }


def features_to_list(features):
    return [
        features["skills_count"],
        features["frontend_skills"],
        features["backend_skills"],
        features["database_skills"],
        features["cloud_skills"],
        features["ai_skills"],
        features["devops_skills"],
        features["project_count"],
        features["github_projects"],
        features["deployed_projects"],
        features["experience_count"],
        features["has_education"],
        features["degree_level"],
       
        features["cgpa"],
        features["college_score"],
        features["certification_count"],
        features["achievement_count"],
        features["has_github"],
        features["has_linkedin"],
        features["has_portfolio"],
        features["avg_project_complexity"],
    ]


def _empty_features():
    return {
        "skills_count": 0,
        "frontend_skills": 0,
        "backend_skills": 0,
        "database_skills": 0,
        "cloud_skills": 0,
        "ai_skills": 0,
        "devops_skills": 0,
        "project_count": 0,
        "github_projects": 0,
        "deployed_projects": 0,
        "experience_count": 0,
        "avg_project_complexity": 0,
        "has_education": 0,
        "degree_level": 0,
        "college_score": 0,
        "cgpa": 0,
        "certification_count": 0,
        "achievement_count": 0,
        "has_github": 0,
        "has_linkedin": 0,
        "has_portfolio": 0,
    }
