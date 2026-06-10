const fetchJobsFromAPI = async (skills, jobTitle) => {
    try {

        const topSkills = skills.slice(0, 3).join(" ");
        const query = jobTitle
            ? `${jobTitle} ${topSkills}`
            : topSkills;

        const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&date_posted=month`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-key": process.env.JSEARCH_API_KEY,
                "x-rapidapi-host": "jsearch.p.rapidapi.com"
            }
        });
        if (!response.ok) {
            throw new Error(
                `JSearch API Error: ${response.status}`
            );
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) return [];
        const employmentMap = {
            fulltime: "fulltime",
            full_time: "fulltime",

            parttime: "parttime",
            part_time: "parttime",

            internship: "internship",
            intern: "internship",

            contractor: "contract",
            contract: "contract",
            temporary: "contract",

            remote: "remote"
        };

        return data.data.slice(0, 10).map((job) => ({
            jobId: job.job_id,
            jobTitle: job.job_title,
            companyName: job.employer_name,
            location: job.job_city
                ? `${job.job_city}, ${job.job_country}`
                : job.job_country || "Remote",
            jobUrl: job.job_apply_link,
            jobDescription: job.job_description?.slice(0, 500) || null,
            jobType:
                employmentMap[
                job.job_employment_type?.toLowerCase()
                ] || "fulltime",
            source: "api"
        }));

    } catch (error) {
        console.log("JSearch API failed:", error);
        return [];
    }
};
export default fetchJobsFromAPI