import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import { FileText, BarChart2, MessageSquare, Briefcase, ArrowRight, Upload, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import axiosInstance from '@/utils/axios'
import { useDispatch } from 'react-redux'
import { setResumes } from '@/redux/slices/resumeSlice'
import { setAnalyses } from '@/redux/slices/analysisSlice'
import { setStats } from '@/redux/slices/jobSlice'
import { ANALYSIS_POINT, job_END_POINT, RESUME_END_POINT } from '@/utils/constent'
import { toast } from 'sonner'

function Dashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { resumes } = useSelector(state => state.resume)
    const { analyses } = useSelector(state => state.analysis)
    const { stats } = useSelector(state => state.job)

    
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [resumeRes, analysisRes, statsRes] = await Promise.all([
                    axiosInstance.get(`${RESUME_END_POINT}/all`),
                    axiosInstance.get(`${ANALYSIS_POINT}/all`),
                    axiosInstance.get(`${job_END_POINT}/stats`)
                ])
                dispatch(setResumes(resumeRes.data.resumes))
                dispatch(setAnalyses(analysisRes.data.analyses))
                dispatch(setStats(statsRes.data.stats))
            } catch (error) {
                toast.error("failed to fatch data")
            }
        }
        fetchDashboardData()
    }, [])

    const activeResume = resumes.find(r => r.isActive)

   
    const latestAnalysis = analyses[0]

    
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 17) return 'Good afternoon'
        return 'Good evening'
    }

    // summary cards data
    const summaryCards = [
        {
            title: 'Resumes',
            value: resumes.length,
            sub: activeResume ? `Active: ${activeResume.fileName}` : 'No active resume',
            icon: FileText,
            path: '/resume',
            color: 'bg-blue-50 text-blue-600'
        },
        {
            title: 'Analyses',
            value: analyses.length,
            sub: latestAnalysis
                ? `Latest ATS: ${latestAnalysis.atsScore}%`
                : 'No analyses yet',
            icon: BarChart2,
            path: '/analysis',
            color: 'bg-green-50 text-green-600'
        },
        {
            title: 'Applications',
            value: stats?.total || 0,
            sub: stats?.interview
                ? `${stats.interview} in interview stage`
                : 'Start applying',
            icon: Briefcase,
            path: '/jobs',
            color: 'bg-purple-50 text-purple-600'
        },
        {
            title: 'Interviews Prepped',
            value: stats?.applied || 0,
            sub: 'Questions practiced',
            icon: MessageSquare,
            path: '/interview',
            color: 'bg-orange-50 text-orange-600'
        },
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Greeting ── */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {getGreeting()}, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Here's your career progress at a glance.
                    </p>
                </div>

                {/* ── Summary Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {summaryCards.map(({ title, value, sub, icon: Icon, path, color }) => (
                        <Card
                            key={title}
                            onClick={() => navigate(path)}
                            className="cursor-pointer hover:shadow-md transition-shadow border-slate-100"
                        >
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-slate-500">{title}</span>
                                    <div className={`p-2 rounded-lg ${color}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">
                                    {value}
                                </div>
                                <p className="text-xs text-slate-400 truncate">{sub}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Quick Actions ── */}
                    <div className="lg:col-span-1">
                        <Card className="border-slate-100">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-slate-900">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[
                                    {
                                        label: 'Upload Resume',
                                        sub: 'Add or update your resume',
                                        icon: Upload,
                                        path: '/resume'
                                    },
                                    {
                                        label: 'Analyze Resume',
                                        sub: 'Check ATS score against a JD',
                                        icon: BarChart2,
                                        path: '/analysis'
                                    },
                                    {
                                        label: 'Practice Interview',
                                        sub: 'AI generated questions',
                                        icon: MessageSquare,
                                        path: '/interview'
                                    },
                                    {
                                        label: 'Find Jobs',
                                        sub: 'Jobs matched to your skills',
                                        icon: Briefcase,
                                        path: '/jobs'
                                    },
                                ].map(({ label, sub, icon: Icon, path }) => (
                                    <button
                                        key={label}
                                        onClick={() => navigate(path)}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                                    >
                                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                                            <Icon className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900">{label}</p>
                                            <p className="text-xs text-slate-400">{sub}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Recent Analyses ── */}
                    <div className="lg:col-span-2">
                        <Card className="border-slate-100">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <CardTitle className="text-base font-semibold text-slate-900">
                                    Recent Analyses
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/analysis')}
                                    className="text-slate-500 hover:text-slate-900 text-xs"
                                >
                                    View all <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {analyses.length === 0 ? (
                                    <div className="text-center py-8">
                                        <TrendingUp className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                        <p className="text-sm text-slate-400">No analyses yet</p>
                                        <Button
                                            size="sm"
                                            className="mt-3 bg-slate-900 hover:bg-slate-700 text-white"
                                            onClick={() => navigate('/analysis')}
                                        >
                                            Run first analysis
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {analyses.slice(0, 4).map((analysis) => (
                                            <div
                                                key={analysis._id}
                                                onClick={() => navigate(`/analysis/${analysis._id}`)}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-slate-100"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 truncate">
                                                        {analysis.jobTitle}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {analysis.companyName || 'No company'} •{' '}
                                                        {new Date(analysis.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                {/* ATS score badge with color */}
                                                <Badge
                                                    className={`ml-3 font-semibold ${
                                                        analysis.atsScore >= 70
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                            : analysis.atsScore >= 40
                                                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-100'
                                                    }`}
                                                >
                                                    {analysis.atsScore}%
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ── Application Pipeline ── */}
                {stats && stats.total > 0 && (
                    <Card className="mt-6 border-slate-100">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Application Pipeline
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/jobs')}
                                className="text-slate-500 hover:text-slate-900 text-xs"
                            >
                                Manage <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                {[
                                    { label: 'Saved', key: 'saved', color: 'bg-slate-100 text-slate-600' },
                                    { label: 'Applied', key: 'applied', color: 'bg-blue-100 text-blue-600' },
                                    { label: 'OA', key: 'oa', color: 'bg-yellow-100 text-yellow-600' },
                                    { label: 'Interview', key: 'interview', color: 'bg-purple-100 text-purple-600' },
                                    { label: 'Offer', key: 'offer', color: 'bg-green-100 text-green-600' },
                                    { label: 'Rejected', key: 'rejected', color: 'bg-red-100 text-red-600' },
                                ].map(({ label, key, color }) => (
                                    <div key={key} className={`${color} rounded-lg p-3 text-center`}>
                                        <div className="text-2xl font-bold">{stats[key] || 0}</div>
                                        <div className="text-xs font-medium mt-1">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

            </main>
        </div>
    )
}

export default Dashboard