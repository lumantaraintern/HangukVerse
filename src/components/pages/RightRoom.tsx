import Image from "next/image"


function RightRoom({ onRight }: { onRight: () => void }) {
  const handleRight = () => onRight()

  return (
    // Full width, allow vertical scroll; prevent horizontal overflow
    <section className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
      {/* Scalable stage without max-width; dark bg hides letterboxing */}
      <div className="relative w-full aspect-[1440/1024] bg-[#0b0813]">
        {/* Background as responsive image (no crop) */}
        <Image
          src="/RightSidePageBg.png"
          alt="Right room background"
          className="absolute inset-0 w-full h-full object-contain object-center block pointer-events-none z-30"
          fill
        />

        {/* Right arrow — positioned with percentages so it scales with the stage */}
        <Image
          src="/rightarrow.png"
          alt="Next"
          onClick={handleRight}
          className="absolute cursor-pointer z-40"
          style={{ top: '56%', right: '1.6%' }}
          width={86}
          height={86}
        />
      </div>
    </section>
  )
}

export default RightRoom
