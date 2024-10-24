import { createContext, ReactNode, useEffect, useReducer, useState } from "react"
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer"
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions"
import { differenceInSeconds } from "date-fns"

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

export const CyclesContext = createContext({} as CyclesContextProps)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

  //Atualizando os cycles para serem usados com reducer
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null
  }, (initialState) => {
    const storedState = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')
    if (storedState)
      return JSON.parse(storedState)

    return initialState
  })

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  // Caso o cara der F5 na página, continuar o contador de onde deveria
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    /**
     * 1: identificar a aplicação que está fazendo o uso do localstorage
     * 2: indicar a versão do localstorage para evitar bugs em produção em caso de mudança de valores
     */
    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])



  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateNewCycleData) {

    const cycleId = String(new Date().getTime())

    const newCycle: Cycle = {
      id: cycleId,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    // Sempre que o estado depender do estado anterior, usar clousure!
    // setCycles(state => [...state, newCycle])

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)

  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
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
