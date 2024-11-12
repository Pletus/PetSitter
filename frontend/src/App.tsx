import { Route, Routes, } from 'react-router-dom'
import Layout from './components/Layout'
import Main from './components/Main'
import Prices from './components/Prices'
import Booking from './components/Booking'
import About from './components/About'
import './App.css'


function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Main />} />
        <Route path='/prices' element={<Prices />}/>
        <Route path='/booking' element={<Booking />}/>
        <Route path='/about' element={<About />}/>
      </Route>
    </Routes>
  )
}

export default App
