import { LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'

function LoginBtn() {
  return (
    <Link to="/login" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
      <div className="text-right">
        <p className="text-[13px] font-semibold text-slate-400">Login</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <LogIn size={18} />
      </div>
    </Link>
  )
}

export default LoginBtn
