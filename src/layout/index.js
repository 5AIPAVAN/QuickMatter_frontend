import React from 'react'
import logo from '../assets/logo.png'

const AuthLayouts = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
          <h1 className='space-grotesk-logoo'>QuickMatter</h1>
        </header>

        { children }
    </>
  )
}

export default AuthLayouts
