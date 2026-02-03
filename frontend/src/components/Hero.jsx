import heroImage from '../assets/images/hero.jpg'

const Hero = () => {
  return (
    <div className='bg-gray-50 flex items-center justify-center'>
        <div className="flex flex-col md:flex-row md:py-10 max-w-360">
            <div className="py-10 md:py-0 flex flex-col gap-15 md:gap-30 lg:gap-45 xl:gap-60 w-full md:w-1/2 text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-center">
                <h1>Build better habits, one day at a time</h1>
                <h3>Track your habits, stay consistent, and see real progress without pressure or overwhelm</h3>
                <h5 className='cursor-pointer hover:text-red-800 transition'>Get started for free</h5>
            </div>
            <div className='w-full md:w-1/2'>
                <img className='object-cover aspect-3/4 md:h-full' src={heroImage}></img>
            </div>
        </div>    
    </div>
    
  )
}

export default Hero