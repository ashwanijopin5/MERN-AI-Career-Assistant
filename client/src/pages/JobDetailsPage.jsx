import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLocation } from "react-router-dom";

import Navbar from '@/components/shared/Navbar'
import axiosInstance from '@/utils/axios'
import { job_END_POINT } from '@/utils/constent'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

function JobDetailsPage() {

    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation();
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)



    const fetchJob = async () => {
        if (location.state?.job) {
        setJob(location.state.job);
        setLoading(false);
        return;
    }

        try {

            const res =await axiosInstance.get(`${job_END_POINT}/saved`)

            const foundJob =
                res.data.jobs.find( item => item._id === id)

            if (!foundJob) {
              toast.error('Job not found')

                navigate('/jobs')

                return
            }

            setJob(foundJob)

        } catch (error) {

            toast.error('Failed to load job')

        } finally {

            setLoading(false)

        }
    }
    
    useEffect(() => {
        fetchJob()
    }, [])
    const handleStatusChange =
        async (status) => {

            try {

                const res =
                    await axiosInstance.put(`${job_END_POINT}/${job._id}/status`,{status})
                setJob(res.data.job)

                toast.success('Status updated')

            } catch (error) {

                toast.error(
                    'Failed to update status'
                )

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

    if (!job) return null

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-8">

                <Button
                    variant="outline"
                    onClick={() =>
                        navigate('/jobs')
                    }
                    className="mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                <Card>

                    <CardHeader>

                        <div className="flex justify-between items-start">

                            <div>

                                <CardTitle className="text-2xl">
                                    {job.jobTitle}
                                </CardTitle>

                                <p className="text-slate-500 mt-2">
                                    {job.companyName}
                                </p>

                            </div>

                            <Badge>
                                {job.applicationStatus}
                            </Badge>

                        </div>

                    </CardHeader>

                    <CardContent>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">

                            <div>

                                <h3 className="font-semibold mb-2">
                                    Location
                                </h3>

                                <p>
                                    {job.location || 'N/A'}
                                </p>

                            </div>

                            <div>

                                <h3 className="font-semibold mb-2">
                                    Job Type
                                </h3>

                                <p>
                                    {job.jobType}
                                </p>

                            </div>

                            <div>

                                <h3 className="font-semibold mb-2">
                                    Source
                                </h3>

                                <p>
                                    {job.source}
                                </p>

                            </div>

                            <div>

                                <h3 className="font-semibold mb-2">
                                    Applied Date
                                </h3>

                                <p>
                                    {
                                        job.appliedDate
                                            ? new Date(
                                                job.appliedDate
                                            ).toLocaleDateString()
                                            : 'Not Applied'
                                    }
                                </p>

                            </div>

                        </div>

                        {job.jobUrl && (

                            <div className="mb-8">

                                <a
                                    href={job.jobUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600"
                                >
                                    View Original Job Posting
                                </a>

                            </div>

                        )}

                        {job.jobDescription && (

                            <Card className="mb-8">

                                <CardHeader>

                                    <CardTitle>
                                        Job Description
                                    </CardTitle>

                                </CardHeader>

                                <CardContent>

                                    <p className="whitespace-pre-wrap">
                                        {job.jobDescription}
                                    </p>

                                </CardContent>

                            </Card>

                        )}

                        <Card className="mb-8">

                            <CardHeader>

                                <CardTitle>
                                    Update Status
                                </CardTitle>

                            </CardHeader>

                            <CardContent>

                                <select
                                    value={
                                        job.applicationStatus
                                    }
                                    onChange={(e) =>
                                        handleStatusChange(
                                            e.target.value
                                        )
                                    }
                                    className="border rounded px-3 py-2"
                                >

                                    <option value="saved">
                                        saved
                                    </option>

                                    <option value="applied">
                                        applied
                                    </option>

                                    <option value="oa">
                                        oa
                                    </option>

                                    <option value="interview">
                                        interview
                                    </option>

                                    <option value="offer">
                                        offer
                                    </option>

                                    <option value="rejected">
                                        rejected
                                    </option>

                                </select>

                            </CardContent>

                        </Card>

                        {job.notes && (

                            <Card>

                                <CardHeader>

                                    <CardTitle>
                                        Notes
                                    </CardTitle>

                                </CardHeader>

                                <CardContent>

                                    {job.notes}

                                </CardContent>

                            </Card>

                        )}

                    </CardContent>

                </Card>

            </main>

        </div>
    )
}

export default JobDetailsPage