import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Navbar from '@/components/shared/Navbar'
import axiosInstance from '@/utils/axios'


import {
    setAllPreps,
    setLoading
} from '@/redux/slices/interviewSlice'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'

import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { INTERVIEW_END_POINT } from '@/utils/constent'

function InterviewHistoryPage() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {
        allPreps,
        loading
    } = useSelector(
        state => state.interview
    )

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {

        dispatch(setLoading(true))

        try {

            const res =
                await axiosInstance.get(
                    `${INTERVIEW_END_POINT}/all`
                )

            dispatch(
                setAllPreps(
                    res.data.preps
                )
            )

        } catch (error) {

            toast.error(
                'Failed to load history'
            )

        } finally {

            dispatch(setLoading(false))

        }
    }

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-8">

                <div className="mb-8">

                    <h1 className="text-2xl font-bold">
                        Interview History
                    </h1>

                    <p className="text-slate-500">
                        Review your previous interview sessions
                    </p>

                </div>

                {
                    allPreps.length === 0 ? (

                        <Card>

                            <CardContent className="py-10 text-center">

                                <h2 className="text-lg font-semibold">
                                    No Interviews Found
                                </h2>

                                <p className="text-slate-500 mt-2">
                                    Generate interview questions from an analysis first.
                                </p>

                            </CardContent>

                        </Card>

                    ) : (

                        <div className="space-y-4">

                            {
                                allPreps.map(
                                    prep => (

                                        <Card
                                            key={prep._id}
                                        >

                                            <CardHeader>

                                                <CardTitle>
                                                    {
                                                        prep.analysisId?.jobTitle ||
                                                        'Untitled Job'
                                                    }
                                                </CardTitle>

                                            </CardHeader>

                                            <CardContent>

                                                <p className="text-slate-500">
                                                    {
                                                        prep.analysisId?.companyName ||
                                                        'Unknown Company'
                                                    }
                                                </p>

                                                <div className="mt-4 flex gap-6">

                                                    <span>
                                                        Questions:
                                                        {' '}
                                                        {
                                                            prep.questions?.length
                                                        }
                                                    </span>

                                                    <span>
                                                        Completed:
                                                        {' '}
                                                        {
                                                            prep.attemptedCount
                                                        }
                                                    </span>

                                                </div>

                                                <Button
                                                    className="mt-4"
                                                    onClick={() =>
                                                        navigate(
                                                            `/interview/${prep.analysisId._id}`
                                                        )
                                                    }
                                                >
                                                    Continue
                                                </Button>

                                            </CardContent>

                                        </Card>
                                    )
                                )
                            }

                        </div>

                    )
                }

            </main>

        </div>
    )
}

export default InterviewHistoryPage