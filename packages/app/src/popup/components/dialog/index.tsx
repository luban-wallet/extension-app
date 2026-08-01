import * as DialogPrimitive from "@radix-ui/react-dialog"
import IconClose from "../icons/close"

import css from './index.module.css'

export function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return (
    <DialogPrimitive.Root data-slot="dialog" {...props} />
  )
}

export function DialogOverlay(props: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  const {children, ...others} = props
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={css.overlay}
      {...others}
    >{children}</DialogPrimitive.Overlay>
  )
}

export function DialogContent(props: {title: string} & React.ComponentProps<typeof DialogPrimitive.Content>) {
  const { title, children, ...others } = props
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal">
      <DialogOverlay>
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={css.content}
          {...others}
        >
          <DialogClose />
          <DialogTitle>{title}</DialogTitle>
          <DialogPrimitive.Description style={{display: 'none'}} />
          <div className={css.main}>
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPrimitive.Portal>
  )
}

export function DialogTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={css.title}
      {...props}
    />
  )
}

export function DialogClose() {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      asChild
    >
      <button type="button" className={css.close}><IconClose /></button>
    </DialogPrimitive.Close>
  )
}
