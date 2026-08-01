import React from 'react'


export interface Props{
    children?: React.ReactNode,
    className?: string
}

const  Container = ({children,className=""}:Props) => {
  return (
    <div className={`mx-auto w-full ${className}`}>{children}</div>
  )
}

export default Container