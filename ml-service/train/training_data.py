import random
import pandas as pd


def calculate_score(row):

    score = 0

    # Skills (max ~25)
    score += row["frontend_skills"] * 2
    score += row["backend_skills"] * 2
    score += row["database_skills"] * 2
    score += row["cloud_skills"] * 3
    score += row["ai_skills"] * 3
    score += row["devops_skills"] * 3

    # Projects (max ~20)
    score += row["project_count"] * 1.0
    score += row["github_projects"] * 1.1
    score += row["deployed_projects"] * 1.1
    score += row["avg_project_complexity"] * 1.5
    # Experience (max ~15)
    score += row["experience_count"] * 4

    # Education (max ~20)
    score += row["degree_level"] * 1
    score += row["college_score"] * 1

    score += max(0, min(10, (row["cgpa"] - 5) * 2))

    # Extras (max ~10)
    score += row["certification_count"]
    score += row["achievement_count"] * 2

    # Presence (max ~10)
    score += row["has_github"] * 3
    score += row["has_linkedin"] * 2
    score += row["has_portfolio"] * 3
    if (
    row["project_count"] >= 5
    and row["skills_count"] >= 10
    and row["cgpa"] >= 8):
     score += 5

    return min(round(score), 100)


def generate_sample():

    frontend = random.randint(0, 3)
    backend = random.randint(0, 3)
    database = random.randint(0, 2)
    cloud = random.randint(0, 1)
    ai = random.randint(0, 2)
    devops = random.randint(0, 1)
    project_count = random.randint(0, 6)
    if project_count == 0:
       avg_project_complexity = 0

    elif project_count <= 2:
        avg_project_complexity = round(random.uniform(2, 6), 1)

    elif project_count <= 4:
        avg_project_complexity = round(random.uniform(4, 8), 1)

    else:
        avg_project_complexity = round(random.uniform(6, 10), 1)

    skills_count = min(frontend + backend + database + cloud + ai + devops, 12)

    

    github_projects = random.randint(0, project_count)

    deployed_projects = random.randint(0, project_count)

    experience_count = random.randint(0, 3)

    has_education = 1

    degree_level = random.choices([1, 2, 3, 4], weights=[5, 75, 15, 5])[0]

    college_score = random.choices(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], weights=[20, 18, 16, 14, 12, 8, 5, 4, 2, 1]
    )[0]

    cgpa = round(random.uniform(5.0, 9.8), 2)

    certification_count = random.randint(0, 6)

    achievement_count = random.randint(0, 3)

    has_github = random.choice([0, 1])

    has_linkedin = random.choice([0, 1])

    has_portfolio = random.choice([0, 1])

    row = {
        "skills_count": skills_count,
        "frontend_skills": frontend,
        "backend_skills": backend,
        "database_skills": database,
        "cloud_skills": cloud,
        "ai_skills": ai,
        "devops_skills": devops,
        "project_count": project_count,
        "github_projects": github_projects,
        "deployed_projects": deployed_projects,
        "experience_count": experience_count,
        "has_education": has_education,
        "degree_level": degree_level,
        "college_score": college_score,
        "cgpa": cgpa,
        "avg_project_complexity": avg_project_complexity,
        "certification_count": certification_count,
        "achievement_count": achievement_count,
        "has_github": has_github,
        "has_linkedin": has_linkedin,
        "has_portfolio": has_portfolio,
    }

    row["score"] = calculate_score(row)

    return row


def get_training_data(num_samples=2000):

    rows = [generate_sample() for _ in range(num_samples)]

    return pd.DataFrame(rows)
