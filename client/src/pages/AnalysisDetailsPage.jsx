import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '@/utils/axios'
import Navbar from '@/components/shared/Navbar'

import {
    setCurrentAnalysis,
    setLoading
} from '@/redux/slices/analysisSlice'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { ANALYSIS_POINT } from '@/utils/constent'
import { toast } from 'sonner'

function AnalysisDetailsPage() {
    const { id } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        currentAnalysis,
        loading
    } = useSelector(state => state.analysis)

    useEffect(() => {
        const fetchAnalysis = async () => {
            dispatch(setLoading(true))

            try {
                const res = await axiosInstance.get(
                    `${ANALYSIS_POINT}/${id}`
                )

                dispatch(
                    setCurrentAnalysis(
                        res.data.analysis
                    )
                )
            } catch (error) {
                toast.error("Failed to fatch analysis")
            } finally {
                dispatch(setLoading(false))
            }
        }

        fetchAnalysis()
    }, [id])

    const getScoreColor = (score) => {
        if (score >= 70)
            return 'bg-green-100 text-green-700'

        if (score >= 40)
            return 'bg-yellow-100 text-yellow-700'

        return 'bg-red-100 text-red-700'
    }

    if (loading || !currentAnalysis) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        )
    }

    const analysis = currentAnalysis

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8">

                {/* Header */}

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <h1 className="text-2xl font-bold">
                            {analysis.jobTitle}
                        </h1>

                        <p className="text-slate-500 mt-1">
                            {analysis.companyName || 'No Company'}
                        </p>

                        <p className="text-xs text-slate-400 mt-2">
                            Resume: {analysis.resumeId?.fileName}
                        </p>
                    </CardContent>

                </Card>

                {/* ATS */}

                <Card className="mb-6">
                    <CardContent className="p-8 text-center">
                        <div
                            className={`inline-flex px-6 py-3 rounded-xl text-3xl font-bold ${getScoreColor(
                                analysis.atsScore
                            )}`}
                        >
                            ATS Score: {analysis.atsScore}%
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-6">

                    {/* Matched */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Matched Keywords
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-wrap gap-2">
                            {analysis.matchedKeywords?.map(
                                (keyword, index) => (
                                    <Badge
                                        key={index}
                                        className="bg-green-100 text-green-700"
                                    >
                                        {keyword}
                                    </Badge>
                                )
                            )}
                        </CardContent>
                    </Card>

                    {/* Missing */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Missing Keywords
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {analysis.missingKeywords?.map(
                                (keyword, index) => (
                                    <Badge
                                        key={index}
                                        className="bg-red-100 text-red-700"
                                    >
                                        {keyword}
                                    </Badge>
                                )
                            )}
                        </CardContent>

                    </Card>

                </div>

                {/* Skill Gaps */}

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>
                            Skill Gaps
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">

                        {analysis.skillGaps?.map(
                            (gap, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between border rounded-lg p-3"
                                >
                                    <span>
                                        {gap.skill}
                                    </span>

                                    <Badge>
                                        {gap.importance}
                                    </Badge>
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>

                {/* Suggestions */}

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>
                            Suggestions
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <ul className="space-y-2">
                            {analysis.suggestions?.map(
                                (item, index) => (
                                    <li key={index}>
                                        • {item}
                                    </li>
                                )
                            )}
                        </ul>
                    </CardContent>
                </Card>

                {/* Feedback */}

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>
                            Overall Feedback
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-slate-600 leading-7">
                            {analysis.overallFeedback}
                        </p>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardContent className="py-8 text-center">

                        <h3 className="text-lg font-semibold">
                            Ready for Interview Preparation?
                        </h3>

                        <p className="text-slate-500 mt-2 mb-4">
                            Generate AI-powered interview questions based on this analysis.
                        </p>

                        <Button
                            onClick={() =>
                                navigate(`/interview/${analysis._id}`)
                            }
                        >
                            Generate Interview Questions
                        </Button>

                    </CardContent>
                </Card>

            </main>
        </div>
    )
}

export default AnalysisDetailsPage