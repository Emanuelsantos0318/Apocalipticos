

import React from 'react'

export default function ImagemLogo({ className = "" }) {
  return (
      <img
          src="/logo-apocalipticos.svg"
          alt="Logo Apocalípticos"
          className={`mx-auto mb-4 max-w-[300px] w-full h-auto ${className}`}
        />
  )
}


