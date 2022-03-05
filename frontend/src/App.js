import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <div>unblur app</div>
          <Routes>
            <Route path='/' element={null} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
