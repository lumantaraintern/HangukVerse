import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function FifthPage({ onExit }: { onExit: () => void }) {
  const [doorsOpen, setDoorsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDoorsOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden bg-[#0b0813]">
      <div className="relative w-full max-w-[1440px] mx-auto aspect-[1440/1024]">
        {/* Outside View (behind doors) */}
        <Image
          src="/1stfloor.png"
          alt="Outside View"
          fill
          className="object-cover object-center z-20 pointer-events-none"
        />

        {/* Lift Interior View */}
        <Image
          src="/inside_lift_12.png"
          alt="Lift Interior View"
          fill
          className="object-cover object-center z-50 pointer-events-none"
        />

        {/* Lift Doors */}
        <div className="absolute inset-0 flex z-40 pointer-events-none">
          {/* Left Door */}
          <motion.div
            className="w-1/2 relative h-full"
            animate={{ x: doorsOpen ? "-100%" : "0%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <Image
              src="/LiftDoorYellowLCopy.png"
              alt="Lift Door Left"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Right Door */}
          <motion.div
            className="w-1/2 relative h-full"
            animate={{ x: doorsOpen ? "100%" : "0%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <Image
              src="/2.png"
              alt="Lift Door Right"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Lift Buttons */}
        <Image
          src="/LiftButtons1.png"
          alt="Lift Buttons"
          height={373}
          width={278}
          className="absolute top-1/3 right-6 z-50 hover:cursor-pointer"
        />

        {/* Exit Button */}
        {doorsOpen && (
          <button
            onClick={onExit}
            className="absolute bottom-10 right-10 z-50 px-6 py-3 rounded-2xl bg-yellow-400 text-black font-bold shadow-lg hover:scale-105 transition"
          >
            Exit Lift
          </button>
        )}
      </div>
    </section>
  );
}

export default FifthPage;
