import React from 'react'
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const user = true
  const cart = [2, 3, 4]
  const isAdmin = false
  return (
    <div className='w-full p-5 top-0 absolute '>
      <div className='flex justify-between px-5'>
        <div>
          <Link to='/'>E-Commerce</Link>
        </div>
        <div className='flex gap-5'>
          <Link to='/cart' className='relative'>
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className='absolute -top-2  -left-2'>{cart.length}</span>
            )}
            <span>Cart</span>
          </Link>
          {user ? (
            <Link
              to='/profile'
              className='flex gap-1 bg-emerald-900 rounded-lg items-center px-2'
            >
              <UserPlus size={24} />
              <span>Profile</span>
            </Link>
          ) : (
            <>
              <Link to='/login'>
                <LogIn size={24} />
                <span> Login</span>
              </Link>
              <Link to='/signup'>
                <UserPlus size={24} />
                <span> Signup</span>
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to='/admin'>
              <Lock size={24} />
              <span>Admin</span>
            </Link>
          )}
          {user && (
            <Link to='/logout'>
              <LogOut size={24} />
              <span>Logout</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
