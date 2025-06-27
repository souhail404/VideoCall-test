import { useState } from 'react'
import './App.css'
import VideoCall from './components/VideoCall'

function App() {
  const [joined , setJoined] = useState(false)

  return (
    <>
      <header>
        <h1>Video integration test </h1>
      </header>
      <main>
        {
          joined ? <></> :
        <button className=''
                onClick={()=> setJoined(true)}>
                  join
        </button>
        }
        { joined ? 
            <VideoCall /> : 
            <></> 
        }
      </main>  
    </>
  )
}

export default App
