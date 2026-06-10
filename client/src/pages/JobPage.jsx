import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Navbar from '@/components/shared/Navbar'
import axiosInstance from '@/utils/axios'

import { setRecommendedJobs, setSavedJobs, setStats, setLoading } from '@/redux/slices/jobSlice'

import { job_END_POINT } from '@/utils/constent'

import { Card, CardContent, } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { Loader2, Bookmark, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { toast } from 'sonner'

function JobPage() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        recommendedJobs,
        savedJobs,
        stats,
        loading
    } = useSelector(state => state.job)

    const [activeTab, setActiveTab] = useState('recommended')

    const [savingJobId, setSavingJobId] = useState(null)

    const [deletingJobId, setDeletingJobId] = useState(null)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {

        dispatch(setLoading(true))

        try {

            const recommendationPromise = axiosInstance.get(`${job_END_POINT}/recommendations`);

            const savedPromise = axiosInstance.get(`${job_END_POINT}/saved`);

            const statsPromise = axiosInstance.get(`${job_END_POINT}/stats`);

            const [
                recommendationRes,
                savedRes,
                statsRes
            ] = await Promise.allSettled([
                recommendationPromise,
                savedPromise,
                statsPromise
            ]);

            dispatch(setRecommendedJobs(recommendationRes.status === "fulfilled"
                ? recommendationRes.value.data.jobs
                : []
            )
            );

            dispatch(setSavedJobs(savedRes.status === "fulfilled"
                ? savedRes.value.data.jobs
                : []
            )
            );

            dispatch(setStats(statsRes.status === "fulfilled"
                ? statsRes.value.data.stats
                : null
            )
            );

        } catch (error) {


            toast.error(
                'Failed to fetch jobs'
            )

        } finally {

            dispatch(setLoading(false))

        }
    }

    const handleSaveJob = async (job) => {

        setSavingJobId(job.jobId)

        try {

            await axiosInstance.post(`${job_END_POINT}/save`, { ...job })

            toast.success('Job saved')

            fetchJobs()

        } catch (error) {

            toast.error(error.response?.data?.message || 'Failed to save job')

        } finally {

            setSavingJobId(null)

        }
    }

    const handleStatusChange = async (id, status) => {

        try {

            await axiosInstance.put(`${job_END_POINT}/${id}/status`, { status })

            toast.success('Status updated')

            fetchJobs()

        } catch (error) {

            toast.error(
                'Failed to update status'
            )

        }
    }

    const handleDelete = async (id) => {

        setDeletingJobId(id)

        try {

            await axiosInstance.delete(`${job_END_POINT}/${id}`)

            toast.success('Job removed')

            fetchJobs()

        } catch (error) {

            toast.error('Delete failed')

        } finally {

            setDeletingJobId(null)

        }
    }

    const getStatusColor = (
        status
    ) => {

        switch (status) {

            case 'offer':
                return 'bg-green-100 text-green-700'

            case 'interview':
                return 'bg-blue-100 text-blue-700'

            case 'applied':
                return 'bg-yellow-100 text-yellow-700'

            case 'rejected':
                return 'bg-red-100 text-red-700'

            default:
                return ''
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

            <main className="max-w-6xl mx-auto px-4 py-8">

                <div className="mb-8">

                    <h1 className="text-2xl font-bold">
                        Job Tracker
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Track jobs and applications
                    </p>

                </div>

                {stats && (

                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">

                        <Card>
                            <CardContent className="p-4 text-center">
                                <h2 className="text-2xl font-bold">
                                    {stats.total}
                                </h2>
                                <p>Total</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 text-center">
                                <h2 className="text-2xl font-bold">
                                    {stats.saved}
                                </h2>
                                <p>Saved</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 text-center">
                                <h2 className="text-2xl font-bold">
                                    {stats.applied}
                                </h2>
                                <p>Applied</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 text-center">
                                <h2 className="text-2xl font-bold">
                                    {stats.oa}
                                </h2>
                                <p>OA</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 text-center">
                                <h2 className="text-2xl font-bold">
                                    {stats.interview}
                                </h2>
                                <p>Interview</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 text-center">
                                <h2 className="text-2xl font-bold">
                                    {stats.offer}
                                </h2>
                                <p>Offer</p>
                            </CardContent>
                        </Card>

                    </div>

                )}

                <div className="flex gap-2 mb-6">

                    <Button
                        variant={activeTab === 'recommended' ? 'default' : 'outline'}
                        onClick={() =>
                            setActiveTab('recommended')
                        }
                    >
                        Recommended Jobs
                    </Button>

                    <Button
                        variant={
                            activeTab === 'saved'
                                ? 'default'
                                : 'outline'
                        }
                        onClick={() =>
                            setActiveTab('saved')
                        }
                    >
                        Saved Jobs
                    </Button>

                </div>

                {activeTab === 'recommended' && (

                    <div className="space-y-4">

                        {recommendedJobs.map(
                            job => (

                                <Card
                                    key={job.jobId}


                                >

                                    <CardContent className="p-6">

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <button
                                                    className="font-semibold text-lg text-left hover:underline"
                                                    onClick={() =>
                                                        navigate(`/jobs/${job.jobId}`, {
                                                            state: { job }
                                                        })
                                                    }
                                                >
                                                    {job.jobTitle}
                                                </button>

                                                <p className="text-slate-500">
                                                    {job.companyName}
                                                </p>

                                                <div className="flex gap-2 mt-3">

                                                    <Badge>
                                                        {job.location}
                                                    </Badge>

                                                    <Badge variant="outline">
                                                        {job.jobType}
                                                    </Badge>

                                                </div>

                                            </div>

                                            {job.isSaved ? (

                                                <Badge>
                                                    Saved
                                                </Badge>

                                            ) : (

                                                <Button
                                                    onClick={() =>
                                                        handleSaveJob(job)
                                                    }
                                                    disabled={
                                                        savingJobId ===
                                                        job.jobId
                                                    }
                                                >
                                                    <Bookmark className="mr-2 h-4 w-4" />
                                                    Save
                                                </Button>

                                            )}

                                        </div>

                                        {job.jobDescription && (

                                            <p className="mt-4 text-sm text-slate-600">
                                                {job.jobDescription}
                                            </p>

                                        )}

                                        {job.jobUrl && (

                                            <a
                                                href={job.jobUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 text-sm mt-4 inline-block"
                                            >
                                                View Job
                                            </a>

                                        )}

                                    </CardContent>

                                </Card>
                            )
                        )}

                    </div>

                )}

                {activeTab === 'saved' && (

                    <div className="space-y-4">

                        {savedJobs.map(  job => (

                                <Card key={job._id}>

                                    <CardContent className="p-6">

                                        <div className="flex justify-between">

                                            <div>

                                                <h2 className="font-semibold text-lg">
                                                    {job.jobTitle}
                                                </h2>

                                                <p className="text-slate-500">
                                                    {job.companyName}
                                                </p>

                                            </div>

                                            <Badge
                                                className={
                                                    getStatusColor(
                                                        job.applicationStatus
                                                    )
                                                }
                                            >
                                                {
                                                    job.applicationStatus
                                                }
                                            </Badge>

                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-4">

                                            <select
                                                value={job.applicationStatus}
                                                onChange={(e) => handleStatusChange(
                                                    job._id,
                                                    e.target.value
                                                )}
                                                className="border rounded px-3 py-2"
                                            >
                                                <option value="saved">saved</option>
                                                <option value="applied">applied</option>
                                                <option value="oa">oa</option>
                                                <option value="interview">interview</option>
                                                <option value="offer">offer</option>
                                                <option value="rejected">rejected</option>
                                            </select>

                                            <Button
                                                variant="destructive"
                                                onClick={() => handleDelete(
                                                    job._id)}
                                            >
                                                {
                                                    deletingJobId ===
                                                        job._id
                                                        ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        )
                                                        : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                            </Button>

                                        </div>

                                    </CardContent>

                                </Card>

                            )
                        )}

                    </div>

                )}

            </main>

        </div>
    )
}

export default JobPage