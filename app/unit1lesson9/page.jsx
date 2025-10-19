import React from 'react'
import Link from 'next/link';
import Lesson2 from '../components/Unit01/lesson02';

const page = () => {
  return (
    <>
           <div className="relative flex items-center justify-center mt-8">
  {/* Back Button - stays on the left */}
  <Link href="/unit01" className="absolute left-8">
    <button
      className="flex items-center gap-2 bg-blue-900 text-white hover:translate-x-2 font-medium px-4 py-2 rounded-full shadow-sm transition-all duration-200"
    >
      <img
        src="/assets/arrow-small.png"
        alt="Back"
        className="w-5 h-5"
      />
      <span className="hidden sm:inline">Back</span>
    </button>
  </Link>

  {/* Centered Title */}
  <h1 className="text-5xl font-bold text-blue-900 text-center pt-5">
    Lesson 9 <br />
    <span className="text-slate-600 font-medium text-3xl">Country & Introduction</span>
  </h1>
</div>
     <Lesson2 selectedCategory={"lesson9"}/>
    </>
  )
}

export default page