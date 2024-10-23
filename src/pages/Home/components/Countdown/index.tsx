import { useContext, useEffect, useState } from "react";
import { CountdownContainer, Separator } from "./styles";
import { CyclesContext } from "../..";
import { differenceInSeconds } from "date-fns";



export function Countdown() {

  const { activeCycle, activeCycleId, markCurrentCycleAsFinished } = useContext(CyclesContext)

  const [amoutSecondsPassed, setAmountSecondsPassed] = useState(0)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amoutSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  useEffect(() => {

    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {

        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
          return
        }

        setAmountSecondsPassed(
          secondsDifference
        )
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }

  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
