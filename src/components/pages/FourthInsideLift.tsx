import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function FourthInsideLift({onFirstFloor}: {onFirstFloor: () => void}) {
  const [doorsClosed, setDoorsClosed] = useState(false);

  useEffect(() => {
    // Close doors after 1 second
    const timer = setTimeout(() => setDoorsClosed(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  const handleUpFloor = () => {
    setTimeout(() => {
      onFirstFloor()
    }, 1000)

  }

  

  return (
    <section className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden bg-[#0b0813]">
      <div className="relative w-full max-w-[1440px] mx-auto aspect-[1440/1024]">
        {/* Lift Interior Background */}
        <Image
          src="/LiftInsideOuterView.png"
          alt="Interior"
          fill
          className="absolute inset-0 object-contain object-center z-20 pointer-events-none"
        />

        {/* Lift Interior View */}
        <Image
          src="/inside_lift_1.png"
          alt="Lift Interior View"
          fill
          className="absolute inset-0 object-contain object-center z-50 pointer-events-none"
        />

        {/* Lift Doors */}
        <div className="absolute inset-0 flex z-40 pointer-events-none">
          {/* Left Door */}
          <motion.div
            className="w-1/2 relative"
            animate={{ x: doorsClosed ? "+40%" : "0%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <Image
              src="/LiftDoorYellowLCopy.png"
              alt="Lift Door Left"
              fill
              className="object-contain object-left"
            />
          </motion.div>

          {/* Right Door */}
          <motion.div
            className="w-1/2 relative"
            animate={{ x: doorsClosed ? "-53%" : "0%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <Image
              src="/LiftDoorYellowR.png"
              alt="Lift Door Right"
              fill
              className="object-contain object-right"
            />
          </motion.div>
        </div>


        {/* Lift Buttons */}
        <Image
          src="/LiftButtons1.png"
          alt="Lift Buttons"
          height={373}
          width={278}
          className="absolute top-60 right-10 z-50 hover:cursor-pointer"
          onClick={handleUpFloor}
        />
      </div>
    </section>
  );
}

export default FourthInsideLift;
