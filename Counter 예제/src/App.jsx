import './App.css'
import Viewer from "./components/Viewer"
import Controller from "./components/Controller"
import { useState, useEffect } from 'react'
import Even from './components/Even'

function App() {

  const [ count, setCount ] = useState(0)
  const [ input, setInput ] = useState("")
  useEffect(()=>{
    console.log('mount')
  },[])

  const onClickBtn = ( value ) =>{
    setCount( count + value )
  }
  return (
    <div className="App">
      <h1>Simple Counter</h1>
      <section>
        <input value={input} onChange = {(e) => {
          setInput(e.target.value)
        }} />
      </section>
      <section>
        <Viewer count = {count}/>
        {count % 2 === 0 ? <Even/> : null}
      </section>
      <section>
        <Controller onClickBtn = {onClickBtn}/>
      </section>
      
    </div>
  )
}

export default App
