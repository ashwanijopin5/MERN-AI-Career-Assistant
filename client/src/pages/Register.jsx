import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/slices/authSlice'
import axiosInstance from '@/utils/axios'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { USER_END_POINT } from '@/utils/constent.js'

function Register() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, loading } = useSelector(state => state.auth)

    const [input, setInput] = useState({
        name: '',
        email: '',
        password: ''
    })

    useEffect(() => {
        if (user) navigate('/dashboard')
    }, [user])

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        if (!input.name || !input.email || !input.password) {
            toast.error("Please fill all fields")
            return
        }

        if (input.password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        try {
            dispatch(setLoading(true))
            const res = await axiosInstance.post(`${USER_END_POINT}/register`, input)
            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/login')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed")
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
                        Your AI career coach starts here
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Join thousands of students who improved their resumes and cracked interviews with CareerAI.
                    </p>

                    {/* steps */}
                    <div className="space-y-3 text-left mt-8">
                        {[
                            { step: '01', text: 'Upload your resume' },
                            { step: '02', text: 'Get ATS score & skill gaps' },
                            { step: '03', text: 'Practice AI interview questions' },
                            { step: '04', text: 'Apply to matched jobs' },
                        ].map(({ step, text }) => (
                            <div key={step} className="flex items-center gap-3">
                                <span className="text-xs font-bold text-yellow-400 bg-white/10 px-2 py-1 rounded">
                                    {step}
                                </span>
                                <span className="text-slate-200 text-sm">{text}</span>
                            </div>
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
                        <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
                        <p className="text-slate-500">Start your AI-powered career journey today</p>
                    </div>

                    {/* form */}
                    <form onSubmit={submitHandler} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    name="name"
                                    value={input.name}
                                    onChange={changeHandler}
                                    placeholder="Ashwani Kumar"
                                    disabled={loading}
                                    className="pl-10 h-11 border-slate-200 focus:border-slate-400"
                                />
                            </div>
                        </div>

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
                                    placeholder="Min. 6 characters"
                                    disabled={loading}
                                    autoComplete="new-password"
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
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>
                                : "Create Account"
                            }
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-slate-900 font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register