import { createContext, ReactNode, useState } from "react"

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextProps {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (newCycle: CreateNewCycleData) => void
  interruptCurrentCycle: () => void
}

interface CreateNewCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextProps)

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    setCycles(state =>
      state.map(cycle => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        }
        return cycle
      })
    )
  }

  function createNewCycle(data: CreateNewCycleData) {

    const cycleId = String(new Date().getTime())

    //Criar novo ciclo
    const newCycle: Cycle = {
      id: cycleId,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    // Sempre que o estado depender do estado anterior, usar clousure!
    setCycles(state => [...state, newCycle])
    setActiveCycleId(cycleId)
    setAmountSecondsPassed(0)

    // console.log(data)

    // reset()
  }

  function interruptCurrentCycle() {

    setCycles(
      cycles.map(cycle => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        }
        return cycle
      })
    )

    setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider value={{
      cycles,
      activeCycle,
      activeCycleId,
      amountSecondsPassed,
      markCurrentCycleAsFinished,
      setSecondsPassed,
      createNewCycle,
      interruptCurrentCycle
    }}>
      {children}
    </CyclesContext.Provider>
  )
}
