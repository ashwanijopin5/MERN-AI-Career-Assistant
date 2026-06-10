import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setLoading } from '@/redux/slices/authSlice'
import axiosInstance from '@/utils/axios'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { USER_END_POINT } from '@/utils/constent'

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, loading } = useSelector(state => state.auth)

    const [input, setInput] = useState({
        email: '',
        password: ''
    })

    
    useEffect(() => {
        if (user) navigate('/')
    }, [user])

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        if (!input.email || !input.password) {
            toast.error("Please fill all fields")
            return
        }

        try {
            dispatch(setLoading(true))
            const res = await axiosInstance.post(`${USER_END_POINT}/login`, input)
            if (res.data.success) {
                dispatch(setUser(res.data.userData))
                toast.success(res.data.message)
                navigate('/')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed")
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="min-h-screen bg-white flex">

            {/* ── Left Panel ── */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-700 flex-col items-center justify-center p-12 text-white">
                <div className="max-w-md text-center space-y-6">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <Sparkles className="h-8 w-8 text-yellow-400" />
                        <span className="text-2xl font-bold tracking-tight">CareerAI</span>
                    </div>
                    <h1 className="text-4xl font-bold leading-tight">
                        Land your dream job with AI
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Upload your resume, get ATS scores, practice interviews, and find matching jobs — all in one place.
                    </p>

                    {/* feature pills */}
                    <div className="flex flex-wrap gap-2 justify-center mt-8">
                        {['ATS Scoring', 'Skill Gap Analysis', 'Interview Prep', 'Job Matching'].map(f => (
                            <span key={f} className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Panel — Form ── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">

                    {/* header */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 lg:hidden mb-6">
                            <Sparkles className="h-6 w-6 text-slate-800" />
                            <span className="text-xl font-bold text-slate-800">CareerAI</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                        <p className="text-slate-500">Sign in to continue your career journey</p>
                    </div>

                    {/* form */}
                    <form onSubmit={submitHandler} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="email"
                                    name="email"
                                    value={input.email}
                                    onChange={changeHandler}
                                    placeholder="you@example.com"
                                    disabled={loading}
                                    className="pl-10 h-11 border-slate-200 focus:border-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="password"
                                    name="password"
                                    value={input.password}
                                    onChange={changeHandler}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    autoComplete="current-password"
                                    className="pl-10 h-11 border-slate-200 focus:border-slate-400"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-slate-900 hover:bg-slate-700 text-white font-medium"
                        >
                            {loading
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
                                : "Sign In"
                            }
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-slate-900 font-semibold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login