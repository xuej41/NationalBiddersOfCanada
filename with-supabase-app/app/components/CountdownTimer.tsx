"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  endTime: Date
  onEnd: () => void
}

export default function CountdownTimer({ endTime, onEnd }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = +new Date(endTime) - +new Date()

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return null
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (!newTimeLeft) {
        clearInterval(timer)
        onEnd()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, onEnd])

  if (!timeLeft) {
    return <div className="text-2xl font-bold text-red-600">Auction Ended</div>
  }

  return (
    <div className="text-2xl font-bold">
      {timeLeft.days > 0 && `${timeLeft.days}d `}
      {timeLeft.hours > 0 && `${timeLeft.hours}h `}
      {timeLeft.minutes > 0 && `${timeLeft.minutes}m `}
      {timeLeft.seconds}s
    </div>
  )
}

