import Image from 'next/image';
// import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F6F0F0] text-brown font-serif">
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-gray-900">Caffeine</h1>
        <nav className="space-x-6 hidden md:flex">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Menu</a>
          <a href="#" className="hover:underline">About Us</a>
          <a href="#" className="hover:underline">Facilities</a>
        </nav>
        <div className="space-x-4 flex items-center">
          <a href="#" className="hover:underline hidden sm:inline-block">Sign In</a>
          <button className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M18.75 10.5a8.25 8.25 0 11-16.5 0 8.25 8.25 0 0116.5 0z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="grid md:grid-cols-2 gap-8 items-center px-6 py-12 md:px-16 lg:px-24">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          Coffee You Love, <br />
          Rewards You Deserve.<br />
            
          </h2>
          <p className="text-gray-900 text-sm md:text-base">
            Experience the rich and bold flavors of our exquisite coffee blends, crafted to awaken
            your senses and start your day right.
          </p>
          <button className="px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-200 transition-all">
            Explore Menu
          </button>
        </div>

        <div className="relative w-full h-96 md:h-[500px]">
          <Image
            src="/coffee-cup.png" 
            alt="Coffee Cup"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
      </main>
    </div>
  )
}
