import Image from "next/image"




function LeftRoom({ onLeft }: { onLeft: () => void }) {
  const handleLeft = () => onLeft()

  return (
    // Full-width, allow vertical scroll, prevent horizontal overflow
    <section className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
      {/* Scalable stage without max-width; dark bg hides letterboxing */}
      <div className="relative w-full aspect-[1440/1024] bg-[#0b0813]">
        {/* Background as responsive image (no crop) */}
        <Image
          src="/LeftSidePageBg.png"
          alt="Left room background"
          className="absolute inset-0 w-full h-full object-contain object-center block pointer-events-none z-30"
          fill
        />

        {/* Left arrow — positioned with percentages so it scales with stage */}
        <Image
          src="/leftarrow.png"
          alt="Back"
          onClick={handleLeft}
          width={86}
          height={86}
          className="absolute cursor-pointer z-40"
          style={{ top: '56%', left: '1.6%' }}
        />
      </div>
    </section>
  )
}

export default LeftRoom
