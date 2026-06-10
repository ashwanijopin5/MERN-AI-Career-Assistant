import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import axiosInstance from '@/utils/axios'
import { toast } from 'sonner'

import {
    setAnalyses,
    setLoading
} from '@/redux/slices/analysisSlice'

import {
    BarChart2,
    Loader2,
    Trash2,

} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ANALYSIS_POINT, RESUME_END_POINT } from '@/utils/constent'


function AnalysisPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const { analyses, loading } = useSelector(state => state.analysis)

    const [resumes, setResumesState] = useState([])

    const [resumeId, setResumeId] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [jobDescription, setJobDescription] = useState('')

    const [analyzing, setAnalyzing] = useState(false)
    const [deletingId, setDeletingId] = useState(null)



    const fetchData = async () => {
        dispatch(setLoading(true))

        try {
            const [resumeRes, analysisRes] = await Promise.all([
                axiosInstance.get(`${RESUME_END_POINT}/all`),
                axiosInstance.get(`${ANALYSIS_POINT}/all`)
            ])

            setResumesState(resumeRes.data.resumes)
            dispatch(setAnalyses(analysisRes.data.analyses))
        } catch (error) {
            toast.error("faild to fetch data")
        } finally {
            dispatch(setLoading(false))
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    const handleAnalyze = async () => {
        if (!resumeId || !jobDescription) {
            return toast.error('Resume and Job Description are required')
        }

        setAnalyzing(true)

        const toastId = toast.loading('Analyzing resume...')

        try {
            const res = await axiosInstance.post(`${ANALYSIS_POINT}/analyze`, {
                resumeId,
                jobTitle,
                companyName,
                jobDescription
            })

            toast.success('Analysis completed', {
                id: toastId
            })

            setJobTitle('')
            setCompanyName('')
            setJobDescription('')

            fetchData()

            navigate(`/analysis/${res.data.analysis._id}`)
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Analysis failed',
                { id: toastId }
            )
        } finally {
            setAnalyzing(false)
        }
    }

    const handleDelete = async (id) => {
        setDeletingId(id)

        try {
            await axiosInstance.delete(`${ANALYSIS_POINT}/${id}`)

            toast.success('Analysis deleted')

            fetchData()
        } catch (error) {
            toast.error('Delete failed')
        } finally {
            setDeletingId(null)
        }
    }

    const getScoreColor = (score) => {
        if (score >= 70)
            return 'bg-green-100 text-green-700'

        if (score >= 40)
            return 'bg-yellow-100 text-yellow-700'

        return 'bg-red-100 text-red-700'
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Resume Analysis
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Analyze your resume against a job description
                    </p>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Run ATS Analysis</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <select
                            value={resumeId}
                            onChange={(e) => setResumeId(e.target.value)}
                            className="w-full border rounded-lg p-3"
                        >
                            <option value="">
                                Select Resume
                            </option>

                            {resumes.map(resume => (
                                <option
                                    key={resume._id}
                                    value={resume._id}
                                >
                                    {resume.fileName}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Job Title"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="text"
                            placeholder="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full border rounded-lg p-3"
                        />

                        <textarea
                            rows={10}
                            placeholder="Paste Job Description"
                            value={jobDescription}
                            onChange={(e) =>
                                setJobDescription(e.target.value)
                            }
                            className="w-full border rounded-lg p-3"
                        />

                        <Button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="bg-slate-900 hover:bg-slate-700"
                        >
                            {analyzing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <BarChart2 className="h-4 w-4 mr-2" />
                                    Analyze Resume
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Analysis History
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        {loading ? (
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        ) : analyses.length === 0 ? (
                            <p className="text-center text-slate-400 py-8">
                                No analyses found
                            </p>
                        ) : (
                            <div className="space-y-3">

                                {analyses.map((analysis) => (
                                    <div
                                        key={analysis._id}
                                        className="border rounded-xl p-4 flex justify-between items-center"
                                    >
                                        <div>
                                            <h3 className="font-semibold">
                                                {analysis.jobTitle}
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                {analysis.companyName || 'No Company'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">

                                            <Badge
                                                className={getScoreColor(
                                                    analysis.atsScore
                                                )}
                                            >
                                                {analysis.atsScore}%
                                            </Badge>

                                            <div className="flex gap-2">

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>navigate(`/analysis/${analysis._id}`)}
                                                >
                                                    ATS
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    onClick={() =>navigate(`/ml-analysis/${analysis._id}`)}
                                                >
                                                    ML
                                                </Button>

                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(analysis._id)}
                                            >
                                                {deletingId === analysis._id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />) : (
                                                    <Trash2 className="h-4 w-4 text-red-500" />)}
                                            </Button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

            </main>
        </div>
    )
}

export default AnalysisPage