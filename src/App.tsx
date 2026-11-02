import { useState } from 'react'
import { FrequentFlyerPortal } from './components/FrequentFlyerPortal'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-main-layout">
      {/* Main Frequent Flyer Portal application */}
      <FrequentFlyerPortal />

      {/* Baseline developer verification bar */}
      <footer className="starter-baseline-container">
        <h1 className="starter-title">
          Get started with Frequent Flyer Portal
        </h1>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((c) => c + 1)}
          aria-label={`Count is ${count}`}
        >
          Count is {count}
        </button>
      </footer>
    </div>
  )
}

export default App

