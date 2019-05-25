import { createContext } from 'react'

const Context = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  pins: [],
  currentPin: null,
  mapStyle: process.env.REACT_APP_MAP_STYLE_STREETS
})

export default Context
