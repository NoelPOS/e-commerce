import React from 'react'
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'

const Navbar = () => {
  const { user, logout } = useUserStore()
  const isAdmin = user?.role === 'admin'
  const cart = user?.cart || []
  return (
    <div className='w-full py-3 '>
      <div className='flex justify-between px-5'>
        <div>
          <Link to='/' className='font-bold text-2xl text-emerald-400'>
            E-Commerce
          </Link>
        </div>
        <div className='flex gap-5 items-center'>
          {user && !isAdmin && (
            <Link
              to='/cart'
              className=' relative flex flex-col gap-1 items-center p-2'
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className='absolute -top-1  left-0'>{cart.length}</span>
              )}
              <span>Cart</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to='/admin'
              className='relative flex flex-col gap-1 items-center p-2'
            >
              <Lock size={24} />
              <span>Admin</span>
            </Link>
          )}

          {user ? (
            <Link
              to='/profile'
              className='relative flex flex-col gap-1 items-center p-2'
            >
              <UserPlus size={22} />
              <span>Profile</span>
            </Link>
          ) : (
            <>
              <Link
                to='/login'
                className='relative flex flex-col gap-1 items-center p-2'
              >
                <LogIn size={24} />
                <span> Login</span>
              </Link>
              <Link
                to='/signup'
                className='relative flex flex-col gap-1 items-center p-2'
              >
                <UserPlus size={24} />
                <span> Signup</span>
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={logout}
              className='relative flex flex-col gap-1 items-center p-2'
            >
              <Link
                to='/logout'
                className='relative flex flex-col gap-1 items-center p-2'
              >
                <LogOut size={24} />
                <span>Logout</span>
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
