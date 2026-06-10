import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setResumes, setLoading } from '@/redux/slices/resumeSlice'
import axiosInstance from '@/utils/axios'
import { toast } from 'sonner'
import { useDropzone } from 'react-dropzone'
import Navbar from '@/components/shared/Navbar'
import { FileText, Upload, Trash2, CheckCircle, Loader2, Eye, Star } from 'lucide-react'
import { Card, CardContent,  } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RESUME_END_POINT } from '@/utils/constent'

function ResumePage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { resumes, loading } = useSelector(state => state.resume)
    const [uploading, setUploading] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [settingActiveId, setSettingActiveId] = useState(null)
   
   
    useEffect(() => {
        const fetchResumes = async () => {
            dispatch(setLoading(true))
            try {
                const res = await axiosInstance.get(`${RESUME_END_POINT}/all`)
                dispatch(setResumes(res.data.resumes))
            } catch (error) {
                toast.error("Failed to fetch resumes")
            } finally {
                dispatch(setLoading(false))
            }
        }
        fetchResumes()
    }, [dispatch])

  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        disabled: uploading,
        onDrop: async (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                toast.error("Only PDF files are allowed")
                return
            }
            if (acceptedFiles.length === 0) return
            await handleUpload(acceptedFiles[0])
        }
    })

    const handleUpload = async (file) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be under 5MB")
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        setUploading(true)
        const toastId = toast.loading("Uploading and parsing resume...")
        try {
            const res = await axiosInstance.post(`${RESUME_END_POINT}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (res.data.success) {
                toast.success("Resume uploaded successfully!", { id: toastId })
                // refresh list
                const updated = await axiosInstance.get(`${RESUME_END_POINT}/all`)
                dispatch(setResumes(updated.data.resumes))
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed", { id: toastId })
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id) => {
        setDeletingId(id)
        try {
            const res = await axiosInstance.delete(`${RESUME_END_POINT}/${id}`)
            if (res.data.success) {
                toast.success(res.data.message)
                const updated = await axiosInstance.get(`${RESUME_END_POINT}/all`)
                dispatch(setResumes(updated.data.resumes))
            }
        } catch (error) {
            toast.error("Failed to delete resume")
        } finally {
            setDeletingId(null)
        }
    }

    const handleSetActive = async (id) => {
        setSettingActiveId(id)
        try {
            const res = await axiosInstance.put(`{RESUME_END_POINT}/${id}/setactive`)
            if (res.data.success) {
                toast.success("Active resume updated")
                const updated = await axiosInstance.get(`${RESUME_END_POINT}all`)
                dispatch(setResumes(updated.data.resumes))
            }
        } catch (error) {
            toast.error("Failed to set active resume")
        } finally {
            setSettingActiveId(null)
        }
    }

    const activeResume = resumes.find(r => r.isActive)

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Page Header ── */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
                    <p className="text-slate-500 mt-1">
                        Upload your resume — we'll parse it and extract your skills automatically.
                    </p>
                </div>

                {/* ── Upload Dropzone ── */}
                <Card className="mb-8 border-slate-100">
                    <CardContent className="p-6">
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
                                ${isDragActive
                                    ? 'border-slate-900 bg-slate-50'
                                    : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                                }
                                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <input {...getInputProps()} />

                            {uploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-10 w-10 text-slate-400 animate-spin" />
                                    <p className="text-slate-500 font-medium">Uploading and parsing...</p>
                                    <p className="text-xs text-slate-400">This may take a few seconds</p>
                                </div>
                            ) : isDragActive ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Upload className="h-10 w-10 text-slate-900" />
                                    <p className="text-slate-900 font-medium">Drop your PDF here</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-4 bg-slate-100 rounded-full">
                                        <Upload className="h-8 w-8 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-slate-700 font-semibold">
                                            Drag & drop your resume here
                                        </p>
                                        <p className="text-slate-400 text-sm mt-1">
                                            or click to browse files
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                        PDF only • Max 5MB
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ── Resume List ── */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
                    </div>
                ) : resumes.length === 0 ? (
                    <Card className="border-slate-100">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <FileText className="h-12 w-12 text-slate-200 mb-4" />
                            <p className="text-slate-500 font-medium">No resumes uploaded yet</p>
                            <p className="text-slate-400 text-sm mt-1">
                                Upload your first resume above to get started
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                            Uploaded Resumes ({resumes.length})
                        </h2>

                        {resumes.map((resume) => (
                            <Card
                                key={resume._id}
                                className={`border transition-all ${
                                    resume.isActive
                                        ? 'border-slate-900 shadow-sm'
                                        : 'border-slate-100 hover:border-slate-300'
                                }`}
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-4">

                                        {/* icon */}
                                        <div className={`p-3 rounded-xl ${
                                            resume.isActive ? 'bg-slate-900' : 'bg-slate-100'
                                        }`}>
                                            <FileText className={`h-5 w-5 ${
                                                resume.isActive ? 'text-white' : 'text-slate-500'
                                            }`} />
                                        </div>

                                        {/* info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-semibold text-slate-900 truncate">
                                                    {resume.fileName}
                                                </p>
                                                {resume.isActive && (
                                                    <Badge className="bg-slate-900 text-white text-xs hover:bg-slate-900">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* extracted skills preview */}
                                            {resume.extractedData?.skills?.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {resume.extractedData.skills.slice(0, 5).map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {resume.extractedData.skills.length > 5 && (
                                                        <span className="text-xs text-slate-400">
                                                            +{resume.extractedData.skills.length - 5} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <p className="text-xs text-slate-400 mt-1.5">
                                                Uploaded {new Date(resume.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        {/* actions */}
                                        <div className="flex items-center gap-2 shrink-0">

                                            {/* view PDF */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => window.open(resume.fileUrl, '_blank')}
                                                className="text-slate-400 hover:text-slate-700"
                                                title="View PDF"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            {/* set active */}
                                            {!resume.isActive && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleSetActive(resume._id)}
                                                    disabled={settingActiveId === resume._id}
                                                    className="text-slate-400 hover:text-yellow-500"
                                                    title="Set as active"
                                                >
                                                    {settingActiveId === resume._id
                                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                                        : <Star className="h-4 w-4" />
                                                    }
                                                </Button>
                                            )}

                                            {/* analyze */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate('/analysis', {
                                                    state: { resumeId: resume._id }
                                                })}
                                                className="text-xs border-slate-200 hover:bg-slate-900 hover:text-white transition-colors"
                                            >
                                                Analyze
                                            </Button>

                                            {/* delete */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(resume._id)}
                                                disabled={deletingId === resume._id}
                                                className="text-slate-400 hover:text-red-500"
                                                title="Delete"
                                            >
                                                {deletingId === resume._id
                                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                                    : <Trash2 className="h-4 w-4" />
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                
                {activeResume && (
                    <Card className="mt-6 border-slate-100 bg-slate-900 text-white">
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-sm">Ready to analyze?</p>
                                <p className="text-slate-400 text-xs mt-0.5">
                                    Your active resume is set. Paste a job description and get your ATS score.
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate('/analysis')}
                                className="bg-white text-slate-900 hover:bg-slate-100 shrink-0 text-sm"
                            >
                                Run Analysis
                            </Button>
                        </CardContent>
                    </Card>
                )}

            </main>
        </div>
    )
}

export default ResumePage