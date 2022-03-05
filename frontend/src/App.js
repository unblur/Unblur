import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
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
