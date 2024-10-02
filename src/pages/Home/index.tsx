import { Play } from "phosphor-react";
import { CountDownContainer, FormContainer, HomeContainer, Separator, StartCountdownButton } from "./styles";

export function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em: </label>
          <input type="text" name="task" id="task" />

          <label htmlFor="minutesAmount">durante</label>
          <input type="number" name="minutesAmount" id="minutesAmount" />

          <span>minutos.</span>
        </FormContainer>
        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>
        <StartCountdownButton type="submit">
          <Play size="24" />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
