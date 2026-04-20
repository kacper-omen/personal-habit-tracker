const Footer = () => {
  return (
    <div className="border-t bg-gray-100 flex flex-col gap-5 items-center text-center py-5 text-gray-700">
        <div>
            <h6 className="text-3xl">Personal Habit Tracker</h6>
            <p className="text-xl">Progress over perfection. Track your habits and celebrate small wins.</p>
        </div>
        <div className="flex gap-5 text-lg">
            <p className="cursor-pointer hover:text-gray-900 hover:border-b transition">Product</p>
            <p className="cursor-pointer hover:text-gray-900 hover:border-b transition">Privacy</p>
            <p className="cursor-pointer hover:text-gray-900 hover:border-b transition">Terms</p>
            <p className="cursor-pointer hover:text-gray-900 hover:border-b transition">Contact</p>
        </div>
        <div>
            <p className="text-xs">© 2026 Personal Habit Tracker</p>
        </div>
    </div>
  )
}

export default Footer
