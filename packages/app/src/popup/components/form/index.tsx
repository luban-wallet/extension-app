import { createContext, useContext } from 'react'

import css from './form.module.css'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children?: React.ReactNode;
  errors?: Record<string, string> | null;
  onClearErrors?: (errors: Record<string, string>) => void;
}

const FormContext = createContext<{errors: Record<string, string> | null} | null>(null);

export function Form(props: FormProps) {
  const { errors = null, children, ...others} = props

  return (
    <FormContext.Provider value={{errors}}>
      <form className={css.form} {...others}>{children}</form>
    </FormContext.Provider>
  )
}

export function FormItem(props: {name?: string, label?: string, action?: React.ReactNode, children?: React.ReactNode}) {
  const { name = '', label = '', action = null, children } = props
  const ctx = useContext(FormContext)

  const errors = ctx?.errors ?? null

  return (
    <div className={css.root}>
      <div className={css.label}>
        <div className={css.title}>{label}</div>
        {action}
      </div>
      {children}
      {errors && errors[name] ? <div className={css.error}>{errors[name]}</div> : null}
    </div>
  )
}
