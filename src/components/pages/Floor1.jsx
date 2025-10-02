import React from 'react'
import Image from 'next/image'
function Floor1({onExit}) {
    return (
        <section className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
            {/* Scalable stage without max-width; background color hides letterboxing */}
            <div className="relative w-full aspect-[1440/1024] bg-[#0b0813]">
                <Image
                    src="/1stfloor.png"
                    alt="Outside View"
                    fill
                    className="object-cover object-center z-20 pointer-events-none"
                />

                <button
                    onClick={onExit}
                    className="absolute bottom-10 right-10 z-50 px-6 py-3 rounded-2xl bg-yellow-400 text-black font-bold shadow-lg hover:scale-105 transition"
                >
                    Exit Lift
                </button>
            </div>
        </section>
    )
}

export default Floor1