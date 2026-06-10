import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import Navbar from '@/components/shared/Navbar'
import axiosInstance from '@/utils/axios'

import {
    setCurrentPrep,
    setLoading
} from '@/redux/slices/interviewSlice'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { Loader2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { INTERVIEW_END_POINT } from '@/utils/constent'

function InterviewPrepPage() {

    const { analysisId } = useParams()

    const dispatch = useDispatch()

    const {
        currentPrep,
        loading
    } = useSelector(state => state.interview)

    const [answers, setAnswers] = useState({})
    const [submittingId, setSubmittingId] = useState(null)
    const [regenerating, setRegenerating] = useState(false)

   
    const fetchInterviewPrep = async () => {
        dispatch(setLoading(true))

        try {

            const res = await axiosInstance.get(
                `${INTERVIEW_END_POINT}/${analysisId}`
            )

            dispatch(
                setCurrentPrep(
                    res.data.interviewPrep
                )
            )

        } catch (error) {

            if (error.response?.status === 404) {

                try {

                    await axiosInstance.post(
                        `${INTERVIEW_END_POINT}/generate`,
                        {
                            analysisId
                        }
                    )

                    const prepRes =
                        await axiosInstance.get(
                            `${INTERVIEW_END_POINT}/${analysisId}`
                        )

                    dispatch(
                        setCurrentPrep(
                            prepRes.data.interviewPrep
                        )
                    )

                } catch (err) {

                    toast.error(
                        'Failed to generate interview questions'
                    )
                }

            }

        } finally {
            dispatch(setLoading(false))
        }
    }

     useEffect(() => {
        fetchInterviewPrep()
    }, [analysisId])


    const handleSubmitAnswer = async (
        questionId
    ) => {

        const answer =
            answers[questionId]

        if (!answer?.trim()) {
            return toast.error(
                'Please enter an answer'
            )
        }

        setSubmittingId(questionId)

        try {

            await axiosInstance.put(
                `${INTERVIEW_END_POINT}/${currentPrep._id}/answer/${questionId}`,
                {
                    userAnswer: answer
                }
            )

            toast.success(
                'Answer submitted'
            )

            fetchInterviewPrep()

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Failed to submit answer'
            )

        } finally {
            setSubmittingId(null)
        }
    }

    const handleRegenerate = async () => {

        setRegenerating(true)

        try {

            const res =
                await axiosInstance.put(
                    `${INTERVIEW_END_POINT}/${currentPrep._id}/regenerate`
                )

            dispatch(
                setCurrentPrep(
                    res.data.interviewPrep
                )
            )

            toast.success(
                'Questions regenerated'
            )

        } catch (error) {

            toast.error(
                'Failed to regenerate'
            )

        } finally {
            setRegenerating(false)
        }
    }

    const getDifficultyColor = (
        difficulty
    ) => {

        if (difficulty === 'easy')
            return 'bg-green-100 text-green-700'

        if (difficulty === 'medium')
            return 'bg-yellow-100 text-yellow-700'

        return 'bg-red-100 text-red-700'
    }

    if (loading || !currentPrep) {

        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        )
    }

    const progress =
        currentPrep.questions.length > 0
            ? Math.round(
                (
                    currentPrep.attemptedCount /
                    currentPrep.questions.length
                ) * 100
            )
            : 0

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8">

                <Card className="mb-6">

                    <CardHeader>

                        <CardTitle>
                            Interview Preparation
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="mb-4">

                            <div className="flex justify-between text-sm mb-2">

                                <span>
                                    Progress
                                </span>

                                <span>
                                    {currentPrep.attemptedCount}
                                    /
                                    {currentPrep.questions.length}
                                </span>

                            </div>

                            <div className="w-full h-3 rounded-full bg-slate-200">

                                <div
                                    className="h-3 rounded-full bg-slate-900"
                                    style={{
                                        width: `${progress}%`
                                    }}
                                />

                            </div>

                        </div>

                        <Button
                            variant="outline"
                            onClick={handleRegenerate}
                            disabled={regenerating}
                        >

                            {
                                regenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Regenerating...
                                    </>
                                ) : (
                                    <>
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Regenerate Questions
                                    </>
                                )
                            }

                        </Button>

                    </CardContent>

                </Card>

                <div className="space-y-6">

                    {
                        currentPrep.questions.map(
                            (
                                question,
                                index
                            ) => (

                                <Card
                                    key={question._id}
                                >

                                    <CardHeader>

                                        <div className="flex flex-wrap gap-2">

                                            <Badge>
                                                Question {index + 1}
                                            </Badge>

                                            <Badge
                                                variant="outline"
                                            >
                                                {
                                                    question.category
                                                }
                                            </Badge>

                                            <Badge
                                                className={
                                                    getDifficultyColor(
                                                        question.difficulty
                                                    )
                                                }
                                            >
                                                {
                                                    question.difficulty
                                                }
                                            </Badge>

                                        </div>

                                        <CardTitle className="mt-3 text-lg">
                                            {
                                                question.questionText
                                            }
                                        </CardTitle>

                                    </CardHeader>

                                    <CardContent>

                                        <textarea
                                            rows={6}
                                            value={
                                                answers[
                                                question._id
                                                ] ??
                                                question.userAnswer ??
                                                ''
                                            }
                                            disabled={
                                                question.isAttempted
                                            }
                                            onChange={(e) =>
                                                setAnswers(
                                                    prev => ({
                                                        ...prev,
                                                        [question._id]:
                                                            e.target.value
                                                    })
                                                )
                                            }
                                            className="w-full border rounded-lg p-3"
                                            placeholder="Write your answer..."
                                        />

                                        {
                                            !question.isAttempted && (
                                                <Button
                                                    className="mt-3"
                                                    onClick={() =>
                                                        handleSubmitAnswer(
                                                            question._id
                                                        )
                                                    }
                                                    disabled={
                                                        submittingId ===
                                                        question._id
                                                    }
                                                >

                                                    {
                                                        submittingId ===
                                                        question._id ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            'Submit Answer'
                                                        )
                                                    }

                                                </Button>
                                            )
                                        }

                                        {
                                            question.userAnswer && (

                                                <Card className="mt-4">

                                                    <CardHeader>
                                                        <CardTitle className="text-base">
                                                            Your Answer
                                                        </CardTitle>
                                                    </CardHeader>

                                                    <CardContent>
                                                        {
                                                            question.userAnswer
                                                        }
                                                    </CardContent>

                                                </Card>

                                            )
                                        }

                                        {
                                            question.aiFeedback && (

                                                <Card className="mt-4 border-green-200">

                                                    <CardHeader>
                                                        <CardTitle className="text-base">
                                                            AI Feedback
                                                        </CardTitle>
                                                    </CardHeader>

                                                    <CardContent>
                                                        {
                                                            question.aiFeedback
                                                        }
                                                    </CardContent>

                                                </Card>

                                            )
                                        }

                                    </CardContent>

                                </Card>
                            )
                        )
                    }

                </div>

            </main>

        </div>
    )
}

export default InterviewPrepPage