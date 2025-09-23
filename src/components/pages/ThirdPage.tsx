import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

function ThirdPage({ onLeft, onRight }: { onLeft: () => void; onRight: () => void }) {
  const [openLift, setOpenLift] = useState(false)
  const [hideLift, setHideLift] = useState(false)

  const handleNext = () => {
    setOpenLift(true)
    setTimeout(() => {
      setHideLift(true)
    }, 1200)
  }

  const handleLeft = () => onLeft()
  const handleRight = () => onRight()

  const handleLiftUp = () => console.log('Lift Up')
  const handleLiftDown = () => console.log('Lift Down')

  return (
    <section className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
      <div className="relative w-full aspect-[1440/1024] bg-[#0b0813]">
        {/* Background Interior */}
        <Image
          src="/interiorzoomin.png"
          alt="Interior"
          fill
          className="absolute inset-0 object-contain object-center block pointer-events-none z-30"
        />

        {/* Left Lift Door */}
        {!hideLift && (
          <motion.img
            src="/interiorliftdoornewl.png"
            alt="Left lift door"
            initial={{ x: '0%' }}
            animate={openLift ? { x: '-100%' } : { x: '0%' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            style={{
              top: '34.77%',
              left: '33.33%',
              width: '21.53%',
              height: '64.84%',
              willChange: 'transform',
            }}
            className="absolute object-contain object-center block z-20"
          />
        )}

        {/* Right Lift Door */}
        {!hideLift && (
          <motion.img
            src="/interiorliftdoornewr.png"
            alt="Right lift door"
            initial={{ x: '0%' }}
            animate={openLift ? { x: '100%' } : { x: '0%' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            style={{
              top: '34.77%',
              left: '47.92%',
              width: '21.53%',
              height: '64.84%',
              willChange: 'transform',
            }}
            className="absolute object-contain object-center block z-20"
          />
        )}

        {/* Open Lift Interior (behind doors) */}
        <div
          className="absolute z-[15] pointer-events-none"
          style={{
            top: '36.72%',
            left: '35.07%',
            width: '32.01%',
            height: '63.28%',
          }}
        >
          <Image
            src="/liftopened.png"
            alt="Lift opened"
            fill
            className="object-contain object-center"
          />
        </div>

        {/* Lift controls */}
        <div
          className="absolute flex flex-col items-center gap-2 z-50"
          style={{ left: '65.56%', top: '61.23%' }}
        >
          <Image
            src="/liftarrowup.png"
            alt="Up"
            width={28}
            height={28}
            onClick={handleLiftUp}
            className="w-6 h-6 md:w-7 md:h-7 cursor-pointer"
          />
          <Image
            src="/liftarrowdown.png"
            alt="Down"
            width={28}
            height={28}
            onClick={handleLiftDown}
            className="w-6 h-6 md:w-7 md:h-7 cursor-pointer"
          />
        </div>

        {/* Call Lift Button */}
        <div className="absolute z-60" style={{ left: '67.57%', top: '61.62%' }}>
          <Button
            className="bg-[#FF98FF] text-white hover:bg-[#AD6BFF] h-8 px-5 rounded-[30px] font-light text-[13px] opacity-90 tracking-[6px]"
            onClick={handleNext}
          >
            Call the Lift
          </Button>
        </div>

        {/* Arrows navigation */}
        <Image
          src="/leftarrow.png"
          alt="Left"
          width={86}
          height={86}
          onClick={handleLeft}
          className="absolute cursor-pointer z-40"
          style={{ top: '55.96%', left: '1.53%' }}
        />
        <Image
          src="/rightarrow.png"
          alt="Right"
          width={86}
          height={86}
          onClick={handleRight}
          className="absolute cursor-pointer z-40"
          style={{ top: '55.96%', right: '1.53%' }}
        />
      </div>
    </section>
  )
}

export default ThirdPage
