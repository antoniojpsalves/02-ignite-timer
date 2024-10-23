import { Play } from "phosphor-react"

import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput
} from "./styles"

import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'

const newCycleFormValidationSchema = z.object({
  task: z.string().min(1, 'Informe a tarefa'),
  minutesAmount: z.number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O clico precisa ser de no máximo 60 minutos')
})

// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }

// mesma coisa que a interface, mas inferindo usando a integração do zod com typescript
type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>

export function Home() {

  const { register, handleSubmit, watch } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  function handleCreateNewCytle(data: NewCycleFormData) {

    console.log(data)
  }

  // habilitar ou desabilitar o botão
  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCytle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em: </label>
          <TaskInput
            id="task"
            type="text"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            {...register("task")}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            placeholder="00"
            type="number"
            step={5}
            min={0}
            max={60}
            {...register("minutesAmount")}
          />

          <span>minutos.</span>
        </FormContainer>
        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>
        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size="24" />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
