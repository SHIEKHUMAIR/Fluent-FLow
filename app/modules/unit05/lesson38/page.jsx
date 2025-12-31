import React from 'react'
import Lesson from '../../../components/lessons/Lesson'
import Link from 'next/link';

const page = () => {
    return (
        <>
            <div className="relative flex items-center justify-center mt-8">
                <Link href="/modules/unit05" className="absolute left-8">
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

                <h1 className="text-5xl font-bold text-blue-900 text-center pt-5">
                    Lesson 38 <br />
                    <span className="text-slate-600 font-medium text-3xl">Everyday Small Talk</span>
                </h1>
            </div>

            <Lesson unitNumber={5} lessonNumber={38} />
        </>
    )
}

export default page
