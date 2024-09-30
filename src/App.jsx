import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Navbar'
import Herosec from './Herosec'

import { initThreeScene } from './Three'
function App() {
  return (
    <>
      <Navbar/>
      <Herosec/>
       <initThreeScene/>
          </>
  )
}

export default App
