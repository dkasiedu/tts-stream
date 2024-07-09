import { useState } from 'react'
import './App.css'
import AudioPlayer from './AudioPlayer'
import AudioGenerator from './AudioGenerator'
import TTSComponent from './TTSComponent'
import TTSComponent01 from './TTSComponent01'

function App() {
  const text = "It provides the look of a terminal and also a bunch of hooks. Xterm does not handle the interpretations of terminal commands, it only provides the interface and captures and makes the user's input available to you through keystroke hooks. It also deals with character encoding and all the little things that deliver that terminal experience."
  // const text = "I am just happy to be here. Bye bye"
  // const text = "Hello model I am world"
  // const text = "Hello world"
  // const text = "I am gay"

  return (
    <>
     <h1>{text}</h1>
     {/* <AudioPlayer />
     <AudioGenerator /> */}
    {/* <TTSComponent {...{text}}/> */}
    <TTSComponent01 text={text}/>
    </>
  )
}

export default App
