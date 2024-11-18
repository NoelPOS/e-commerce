import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Category from './pages/Category'
import Cart from './pages/Cart'
import PurchaseSuccess from './pages/PurchaseSuccess'

import { useUserStore } from './stores/useUserStore'
import { useEffect } from 'react'

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore()

  console.log(user)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/signup'
          element={!user ? <SignUp /> : <Navigate to='/' />}
        />
        <Route
          path='/login'
          element={!user ? <Login /> : <Navigate to='/' />}
        />
        <Route
          path='/admin'
          element={
            user?.role === 'admin' ? <Admin /> : <Navigate to='/login' />
          }
        />
        <Route
          path='/category/:category'
          element={user ? <Category /> : <Navigate to='/login' />}
        />
        <Route
          path='/cart'
          element={user ? <Cart /> : <Navigate to='/login' />}
        />

        <Route
          path='/purchase-success'
          element={user ? <PurchaseSuccess /> : <Navigate to='/login' />}
        />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  )
}

export default App
