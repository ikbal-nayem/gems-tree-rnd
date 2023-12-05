type DrawerBodyProps = {
  children: JSX.Element | JSX.Element[] | string
}

const DrawerBody = ({children}: DrawerBodyProps) => {
  return <div className='px-6 py-3'>{children}</div>
}

export default DrawerBody
