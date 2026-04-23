const Footer = () => {
  return (
    <div className="border-t-4 border-slate-800 bg-slate-900/80 flex flex-col gap-5 items-center text-center py-5 text-slate-200">
        <div>
            <h6 className="text-3xl font-bold pb-4">Personal Habit Tracker</h6>
            <p className="text-xl">Progress over perfection. Track your habits and celebrate small wins.</p>
        </div>
        <div className="flex gap-5 text-lg">
            <p className="cursor-pointer hover:text-slate-400 transition">Product</p>
            <p className="cursor-pointer hover:text-slate-400 transition">Privacy</p>
            <p className="cursor-pointer hover:text-slate-400 transition">Terms</p>
            <p className="cursor-pointer hover:text-slate-400 transition">Contact</p>
        </div>
        <div>
            <p className="text-xs">© 2026 Personal Habit Tracker</p>
        </div>
    </div>
  )
}

export default Footer
