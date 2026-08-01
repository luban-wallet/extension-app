import { Toaster } from "sonner"

import css from './index.module.css'

export default function Toast() {
  return (
    <Toaster
      expand={true}
      position="top-center"
      mobileOffset={{
        left: 50
      }}
      
      // duration={300000}
      toastOptions={{
        style: {
          border: 0
        },
        // unstyled: true,
        classNames: {
          success: css.success,
          error: css.error,
        },
      }}
    />
  )
}