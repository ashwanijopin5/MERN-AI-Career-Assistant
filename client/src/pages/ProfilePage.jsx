import { useState } from "react";
import { useSelector } from "react-redux";

import Navbar from "@/components/shared/Navbar";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditProfileDialog from "./EditProfileDialog";

function ProfilePage() {
  const [open, setOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { resumes } = useSelector((state) => state.resume);
  const { analyses } = useSelector((state) => state.analysis);
  const { stats } = useSelector((state) => state.job);

  const activeResume = resumes.find(
    (resume) => resume.isActive
  );

  const latestAnalysis = analyses[0];

  const skills =
    activeResume?.extractedData?.skills || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Profile Header */}

        <Card className="mb-6">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <img
                src={
                  user?.avatar?.url ||
                  "https://ui-avatars.com/api/?name=" +
                  user?.name
                }
                alt={user?.name}
                className="w-20 h-20 rounded-full object-cover border"
              />

              <div>
                <h1 className="text-2xl font-bold">
                  {user?.name}
                </h1>

                <p className="text-slate-500">
                  {user?.email}
                </p>


              </div>

            </div>

            <Button
              onClick={() => setOpen(true)}
            >
              Edit Profile
            </Button>

          </CardContent>
        </Card>

        {/* Snapshot */}

        <div className="grid md:grid-cols-5 gap-4 mb-6">

          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-3xl font-bold">
                {resumes.length}
              </h2>
              <p>Resumes</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-3xl font-bold">
                {analyses.length}
              </h2>
              <p>Analyses</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-3xl font-bold">
                {stats?.total || 0}
              </h2>
              <p>Applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-3xl font-bold">
                {stats?.interview || 0}
              </h2>
              <p>Interviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">

              <h2 className="text-3xl font-bold text-blue-600">
                {latestAnalysis?.mlScore || 0}%
              </h2>

              <p>Resume Strength</p>

            </CardContent>
          </Card>

        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Profile Completion
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{
                  width: `${latestAnalysis?.mlScore || 0
                    }%`
                }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Profile Strength:
              {" "}
              {latestAnalysis?.mlScore || 0}%
            </p>

          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Active Resume */}

          <Card>

            <CardHeader>
              <CardTitle>
                Active Resume
              </CardTitle>
            </CardHeader>

            <CardContent>

              {activeResume ? (
                <>
                  <p className="font-medium">
                    {activeResume.fileName}
                  </p>

                  <p className="text-sm text-slate-500 mt-2">
                    Skills Extracted:
                    {" "}
                    {skills.length}
                  </p>
                </>
              ) : (
                <p>No active resume</p>
              )}

            </CardContent>

          </Card>

          {/* Latest ATS */}

          <Card>

            <CardHeader>
              <CardTitle>
                Latest ATS Analysis
              </CardTitle>
            </CardHeader>

            <CardContent>

              {latestAnalysis ? (
                <>
                  <p className="font-medium">
                    {latestAnalysis.jobTitle}
                  </p>

                  <div className="space-y-2 mt-2">
                    <p>
                      ATS Score:
                      <span className="font-semibold ml-2">
                        {latestAnalysis.atsScore}%
                      </span>
                    </p>

                    <p>
                      ML Score:
                      <span className="font-semibold ml-2">
                        {latestAnalysis.mlScore ?? "N/A"}%
                      </span>
                    </p>

                    <p>
                      Match Score:
                      <span className="font-semibold ml-2">
                        {latestAnalysis.finalMatchScore ?? "N/A"}%
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <p>No analysis found</p>
              )}

            </CardContent>

          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Resume Quality
              </CardTitle>
            </CardHeader>

            <CardContent>
              {activeResume ? (
                <>
                  <p>
                    Skills:
                    {" "}
                    {activeResume.extractedData?.skills?.length || 0}
                  </p>

                  <p>
                    Projects:
                    {" "}
                    {activeResume.extractedData?.projects?.length || 0}
                  </p>

                  <p>
                    Experience:
                    {" "}
                    {activeResume.extractedData?.experience?.length || 0}
                  </p>
                </>
              ) : (
                <p>No Resume</p>
              )}
            </CardContent>
          </Card>

          {/* Skills */}

          <Card>
            <CardHeader>
              <CardTitle>
                Skills & Certifications
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map(skill => (
                  <Badge key={skill}>
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="space-y-1">
                {activeResume?.certifications?.map(cert => (
                  <p
                    key={cert}
                    className="text-sm"
                  >
                    • {cert}
                  </p>
                ))}
              </div>

            </CardContent>
          </Card>

          <Card>

            <CardHeader>
              <CardTitle>
                Achievements
              </CardTitle>
            </CardHeader>

            <CardContent>

              {activeResume?.achievements?.length > 0 ? (

                activeResume.achievements.map(item => (
                  <p
                    key={item}
                    className="text-sm"
                  >
                    • {item}
                  </p>
                ))

              ) : (

                <p>No achievements found</p>

              )}

            </CardContent>

          </Card>

          <Card>

            <CardHeader>
              <CardTitle>
                Professional Presence
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">

              <Badge
                variant={
                  activeResume?.links?.github
                    ? "default"
                    : "secondary"
                }
              >
                {activeResume?.links?.github
                  ? "✓ GitHub"
                  : "GitHub"}
              </Badge>

              <Badge
                variant={
                  activeResume?.links?.linkedin
                    ? "default"
                    : "secondary"
                }
              >
                {activeResume?.links?.linkedin
                  ? "✓ LinkedIn"
                  : "LinkedIn"}
              </Badge>

              <Badge
                variant={
                  activeResume?.links?.portfolio
                    ? "default"
                    : "secondary"
                }
              >
                {activeResume?.links?.portfolio
                  ? "✓ Portfolio"
                  : "Portfolio"}
              </Badge>

            </CardContent>

          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Latest Feedback
              </CardTitle>
            </CardHeader>

            <CardContent>

              {latestAnalysis?.overallFeedback ? (
                <p className="text-sm text-slate-600">
                  {latestAnalysis.overallFeedback}
                </p>
              ) : (
                <p>No feedback yet</p>
              )}

            </CardContent>
          </Card>

          {/* Application Progress */}

          <Card>

            <CardHeader>
              <CardTitle>
                Application Progress
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="grid grid-cols-3 gap-3">

                <Badge>
                  Saved:
                  {" "}
                  {stats?.saved || 0}
                </Badge>

                <Badge>
                  Applied:
                  {" "}
                  {stats?.applied || 0}
                </Badge>

                <Badge>
                  OA:
                  {" "}
                  {stats?.oa || 0}
                </Badge>

                <Badge>
                  Interview:
                  {" "}
                  {stats?.interview || 0}
                </Badge>

                <Badge>
                  Offer:
                  {" "}
                  {stats?.offer || 0}
                </Badge>

                <Badge>
                  Rejected:
                  {" "}
                  {stats?.rejected || 0}
                </Badge>

              </div>

            </CardContent>

          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Recent Analyses
              </CardTitle>
            </CardHeader>

            <CardContent>

              {analyses.slice(0, 3).map(item => (
                <div
                  key={item._id}
                  className="mb-3 border-b pb-2"
                >
                  <p className="font-medium">
                    {item.jobTitle}
                  </p>

                  <p className="text-sm text-slate-500">
                    ATS: {item.atsScore}% |
                    ML: {item.mlScore}%
                  </p>
                </div>
              ))}

            </CardContent>
          </Card>

        </div>

      </main>

      <EditProfileDialog
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}

export default ProfilePage;