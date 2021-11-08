// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// Custom `useLocalStorageState` hook
// Supports:
//    - reading from and writing to the localStorage key provided
//    - custom serializer and deserializer that can be passed into the options object
//    - lazy default state initialization
function useLocalStorageState(
  key,
  defaultState = '',
  {serializer = JSON.stringify, deserializer = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    console.log('lazy initializer ran') // should only logged once, on the first render

    // The default state can be an initializer function
    const defaultStateValue =
      typeof defaultState === 'function' ? defaultState() : defaultState

    return deserializer(window.localStorage.getItem(key)) || defaultStateValue
  })

  React.useEffect(() => {
    console.log('effect (writing to local storage) ran')
    window.localStorage.setItem(key, serializer(state))
  }, [key, state, serializer])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  // const [name, setName] = React.useState(() => {
  //   console.log('initialized') // should only logged once, on the first render
  //   return window.localStorage.getItem('name') || initialName
  // })

  // React.useEffect(() => {
  //   console.log('effect: writing to local storage')
  //   window.localStorage.setItem('name', name)
  // }, [name])

  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(() => {
      console.log('updating state')

      return event.target.value
    })
  }

  console.log('returning react elements')

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return (
    <Greeting
      initialName={() => {
        console.log('default state initializer ran')
        return ''
      }}
    />
  )
}

export default App
