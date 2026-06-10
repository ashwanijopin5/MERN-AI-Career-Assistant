import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/slices/authSlice'
import axiosInstance from '@/utils/axios'
import { toast } from 'sonner'
import { Sparkles, LayoutDashboard, FileText, BarChart2, MessageSquare, Briefcase, LogOut, User } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { USER_END_POINT } from '@/utils/constent'

const navLinks = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Resume', path: '/resume', icon: FileText },
    { label: 'Analysis', path: '/analysis', icon: BarChart2 },
    { label: 'Interview', path: '/interview', icon: MessageSquare },
    { label: 'Jobs', path: '/jobs', icon: Briefcase },
]

function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useSelector(state => state.auth)
  
    const logout = async () => {
        try {
            await axiosInstance.get(`${USER_END_POINT}/logout`)
            dispatch(setUser(null))
            toast.success("Logged out successfully")
            navigate('/login')
        } catch (error) {
            toast.error("Logout failed")
        }
    }


    const getInitials = (name) => {
        if (!name) return 'U'
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">


                    <Link
                        to="/"
                        className="flex items-center gap-2 font-bold text-slate-900 text-lg hover:opacity-80 transition"
                    >
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        CareerAI
                    </Link>


                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ label, path, icon: Icon }) => {
                            const isActive = location.pathname === path
                            return (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </Link>
                            )
                        })}
                    </div>


                    <div className="flex items-center gap-3">

                        {/* user avatar + dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-300">

                                    <Avatar className="h-9 w-9 cursor-pointer border-2 border-slate-200 hover:border-slate-400 transition">
                                        <AvatarImage
                                            src={user?.avatar?.url}
                                            alt={user?.name}
                                        />
                                        <AvatarFallback className="bg-slate-900 text-white text-sm font-semibold">
                                            {getInitials(user?.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium">
                                            {user?.name}
                                        </p>
                                    </div>

                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => navigate('/profile')}
                                    className="cursor-pointer"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={logout}
                                    className="cursor-pointer text-red-500 focus:text-red-500"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* ── Mobile Bottom Nav ── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50">
                <div className="flex items-center justify-around px-2 py-2">
                    {navLinks.map(({ label, path, icon: Icon }) => {
                        const isActive = location.pathname === path
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-md transition-colors
                                    ${isActive
                                        ? 'text-slate-900'
                                        : 'text-slate-400'
                                    }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                                <span className="text-[10px] font-medium">{label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}

export default Navbar