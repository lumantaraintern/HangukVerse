import { Button } from '@/components/ui/button'
import Image from 'next/image'

function SecondPage({ onNext }: { onNext: () => void }) {
  const handleNext = () => {
    setTimeout(() => {
      onNext()
    }, 1000)
  }

  return (
    // Full-width page; allow vertical scroll, prevent horizontal overflow
    <section className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
      {/* Scalable stage without max-width; background color hides letterboxing */}
      <div className="relative w-full aspect-[1440/1024] bg-[#0b0813]">
        {/* Top image (nav backdrop) */}
        <Image
          src="/Hangukverse_bg_Nav2.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-contain object-top block pointer-events-none z-30"
          fill
        />

        {/* Exterior */}
        <Image
          src="/exterior.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain object-center block pointer-events-none z-20"
          fill
        />

        {/* Interior (behind lift doors) */}
        <Image
          src="/interior.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain object-center block pointer-events-none z-10"
          fill
        />

        {/* Lift doors */}
        <Image
          src="/liftdoorl.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain object-center block pointer-events-none z-5"
          fill
        />
        <Image
          src="/liftdoorr.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain object-center block pointer-events-none z-5"
          fill
        />

        {/* Foreground content */}
        <div className="absolute z-50"
          style={{
            left: '50%',   // X% from the left of the 1440 canvas
            top: '65%',    // Y% from the top of the 1024 canvas
            transform: 'translate(-50%, -50%)', // center the button on that point
          }}>
          <Button
            className="bg-[#270157] text-white hover:bg-[#AD6BFF] w-40 h-9 rounded-[30px] font-light text-sm opacity-90"
            onClick={handleNext}
          >
            Once more
          </Button>
        </div>
      </div>
    </section>
  )
}

export default SecondPage
