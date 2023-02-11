/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet} from 'react-router-dom'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div
      className='d-flex flex-column flex-root h-100'
      id='kt_app_root'
      style={{backgroundImage: "url('/media/auth/bg10.jpeg')"}}
    >
      <div className='d-flex flex-column flex-lg-row flex-column-fluid'>
        <div className='d-flex flex-lg-row-fluid'>
          <div className='d-flex flex-column flex-center pb-0 pb-lg-10 p-10 w-100'>
            <img
              className='theme-light-show mx-auto mw-100 w-150px w-lg-200px mb-10 mb-lg-20'
              src='/media/auth/gov-logo.png'
              alt=''
            />
            <img
              className='theme-dark-show mx-auto mw-100 w-150px w-lg-200px mb-10 mb-lg-20'
              src='/media/auth/gov-logo.png'
              alt=''
            />
            <h1 className='text-gray-800 fs-2qx fw-bold text-center mb-7'>
              Government Employee Management System
            </h1>
            <div className='text-gray-600 fs-base text-center fw-semibold'>
              In this kind of post,
              <a href='#' className='opacity-75-hover text-primary me-1'>
                the blogger
              </a>
              introduces a person they’ve interviewed
              <br />
              and provides some background information about
              <a href='#' className='opacity-75-hover text-primary me-1'>
                the interviewee
              </a>
              and their
              <br />
              work following this is a transcript of the interview.
            </div>
          </div>
        </div>
        <div className='d-flex flex-column-fluid flex-lg-row-auto justify-content-center justify-content-lg-end p-12'>
          <div className='bg-body d-flex flex-center rounded-4 w-md-600px p-10'>
            <div className='w-md-400px'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // return (
  //   <div className='d-flex flex-column flex-lg-row flex-column-fluid h-100'>
  //     {/* begin::Body */}
  //     <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1'>
  //       {/* begin::Form */}
  //       <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
  //         {/* begin::Wrapper */}
  //         <div className='w-lg-500px p-10'>
  //           <Outlet />
  //         </div>
  //         {/* end::Wrapper */}
  //       </div>
  //       {/* end::Form */}

  //       {/* begin::Footer */}
  //       <div className='d-flex flex-center flex-wrap px-5'>
  //         {/* begin::Links */}
  //         <div className='d-flex fw-semibold text-primary fs-base'>
  //           <a href='#' className='px-5' target='_blank'>
  //             Terms
  //           </a>

  //           <a href='#' className='px-5' target='_blank'>
  //             Plans
  //           </a>

  //           <a href='#' className='px-5' target='_blank'>
  //             Contact Us
  //           </a>
  //         </div>
  //         {/* end::Links */}
  //       </div>
  //       {/* end::Footer */}
  //     </div>
  //     {/* end::Body */}

  //     {/* begin::Aside */}
  //     <div
  //       className='d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2'
  //       style={{backgroundImage: `url(${toAbsoluteUrl('/media/auth/auth-bg.png')})`}}
  //     >
  //       {/* begin::Content */}
  //       <div className='d-flex flex-column flex-center py-15 px-5 px-md-15 w-100'>
  //         {/* begin::Logo */}
  //         <Link to='/' className='mb-12'>
  //           <img
  //             alt='Logo'
  //             src={toAbsoluteUrl('/media/logos/default-light.svg')}
  //             className='h-75px'
  //           />
  //         </Link>
  //         {/* end::Logo */}

  //         {/* begin::Title */}
  //         <h1 className='text-white fs-2qx fw-bolder text-center mb-7'>
  //           Fast, Efficient and Productive
  //         </h1>
  //         {/* end::Title */}

  //         {/* begin::Text */}
  //         <div className='text-white fs-base text-center'>
  //           In this kind of post,{' '}
  //           <a href='#' className='opacity-75-hover text-warning fw-bold me-1'>
  //             the blogger
  //           </a>
  //           introduces a person they’ve interviewed <br /> and provides some background information
  //           about
  //           <a href='#' className='opacity-75-hover text-warning fw-bold me-1'>
  //             the interviewee
  //           </a>
  //           and their <br /> work following this is a transcript of the interview.
  //         </div>
  //         {/* end::Text */}
  //       </div>
  //       {/* end::Content */}
  //     </div>
  //     {/* end::Aside */}
  //   </div>
  // )
}

export {AuthLayout}
