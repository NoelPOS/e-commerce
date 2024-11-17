import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Category from './pages/Category'
import Cart from './pages/Cart'
import PurchaseSuccess from './pages/PurchaseSuccess'

function App() {
  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      <div className='absolute inset-0'>
        <div className='absolute right-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
      </div>

      <div className='relative z-50 pt-20'>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/category/:category' element={<Category />} />
          <Route path='/cart' element={<Cart />} />

          <Route path='/purchase-success' element={<PurchaseSuccess />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
