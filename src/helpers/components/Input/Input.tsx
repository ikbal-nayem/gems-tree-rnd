import clsx from 'clsx'

type autoComplete = 'on' | 'off'

type Props = {
  required?: boolean
  labelText?: string
  helpText?: string

  className?: string
  autoComplete?: autoComplete
  readOnly?: boolean
  disable?: boolean
  // event handler
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const Input: React.FC<Props> = ({
  required,
  labelText = 'type your label',
  helpText,
  className = '',
  autoComplete = 'on',
  readOnly,
  disable,
  // event handler
  onClick,
  onChange,
  onFocus,
  onBlur,
}) => {
  return (
    <div>
      <div>
        {labelText && (
          <label className={clsx(`${required ? 'required' : ''} fw-bold fs-6 mb-2`)}>
            {labelText}
          </label>
        )}

        {/* begin::Input */}
        <input
          placeholder='Full name'
          type='text'
          name='name'
          className={
            clsx(
              'form-control form-control-solid mb-3 mb-lg-0'
              // {'is-invalid': formik.touched.name && formik.errors.name},
              // {
              //   'is-valid': formik.touched.name && !formik.errors.name,
              // }
            ) + className
          }
          disabled={disable}
          onClick={onClick}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
          autoComplete={autoComplete}
          // disabled={formik.isSubmitting || isUserLoading}
        />
      </div>
      {/* help text */}
      {helpText && <div className='form-text'>{helpText}</div>}

      {/* <div className='card-body'>
        <div className='form-group row'>
          <label className='col-form-label text-right col-lg-3 col-sm-12'>Valid State</label>
          <div className='col-lg-4 col-md-9 col-sm-12'>
            <div className='input-group'>
              <input
                className='form-control is-valid'
                id='kt_timepicker_1_validate'
                readOnly
                placeholder='Select time'
                type='text'
              />
              <div className='input-group-append'>
                <span className='input-group-text'>
                  <i className='la la-clock-o'></i>
                </span>
              </div>
              <div className='valid-feedback'>Success! You"ve done it.</div>
            </div>
            <span className='form-text text-muted'>Example help text that remains unchanged.</span>
          </div>
        </div>
        <div className='form-group row has-danger'>
          <label className='col-form-label text-right col-lg-3 col-sm-12'>Error State</label>
          <div className='col-lg-4 col-md-9 col-sm-12'>
            <div className='input-group timepicker'>
              <input
                className='form-control is-invalid'
                id='kt_timepicker_2_validate'
                readOnly
                placeholder='Select time'
                type='text'
              />
              <div className='input-group-append'>
                <span className='input-group-text'>
                  <i className='la la-clock-o'></i>
                </span>
              </div>
              <div className='invalid-feedback'>Sorry, that username"s taken. Try another?</div>
            </div>
            <span className='form-text text-muted'>Example help text that remains unchanged.</span>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Input
