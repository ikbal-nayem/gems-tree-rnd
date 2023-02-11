// ** Imports createContext function
import {createContext} from 'react'

// ** Imports createContextualCan function
import {createContextualCan} from '@casl/react'
import ability from '@acl/ability'

// ** Create Context
export const AbilityContext = createContext({})

// ** Init Can Context
export const Can = createContextualCan(AbilityContext.Consumer)

export const AbilityProvider = (props) => {
  return (
    <AbilityContext.Provider value={ability}>
      <>{props.children}</>
    </AbilityContext.Provider>
  )
}
