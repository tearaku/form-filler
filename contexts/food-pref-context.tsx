import { createContext, useContext, useState } from "react"

export const FoodPrefContext = createContext({
  riceAmount: 0,
  numOfMales: 0,
  numOfFemales: 0,
  // All of these are UPDATEs (adding onto, instead of replacing)
  setRiceAmount: (toAdd: number) => { },
  setNumOfMales: () => { },
  setNumOfFemales: () => { },
})

// NOTE: passing function into setState for atomic-setState
export const FoodPrefContextProvider = (props) => {
  const setRiceAmount = (toAdd: number) => {
    setState((prevState) => {
      return { ...prevState, riceAmount: prevState.riceAmount + toAdd }
    })
  }
  const setNumOfMales = () => {
    setState((prevState) => {
      return { ...prevState, numOfMales: prevState.numOfMales + 1 }
    })
  }
  const setNumOfFemales = () => {
    setState((prevState) => {
      return { ...prevState, numOfFemales: prevState.numOfFemales + 1 }
    })
  }
  const initState = {
    riceAmount: 0,
    numOfMales: 0,
    numOfFemales: 0,
    setRiceAmount: setRiceAmount,
    setNumOfMales: setNumOfMales,
    setNumOfFemales: setNumOfFemales
  }

  const [state, setState] = useState(initState)

  return (
    <FoodPrefContext.Provider value={state}>
      {props.children}
    </FoodPrefContext.Provider>
  )
}
