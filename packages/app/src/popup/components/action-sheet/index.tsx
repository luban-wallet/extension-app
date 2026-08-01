import * as DialogPrimitive from "@radix-ui/react-dialog"
import IconClose from "../icons/close"

import css from './index.module.css'
import Loading from "../loading"

export function ActionSheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return (
    <DialogPrimitive.Root data-slot="dialog" {...props} />
  )
}

export function ActionSheetOverlay(props: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={css.overlay}
      {...props}
    />
  )
}

export function ActionSheetContent(props: {title: string, loading?: boolean} & React.ComponentProps<typeof DialogPrimitive.Content>) {
  const { title, loading = false, children, ...others } = props
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal">
      <ActionSheetOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={css.content}
        {...others}
      >
        <ActionSheetClose />
        <ActionSheetTitle>{title}</ActionSheetTitle>
        <DialogPrimitive.Description style={{display: 'none'}} />
        <div className={css.main}>
          {loading ? <div className={css.loading}><Loading /></div> : null}
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function ActionSheetTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={css.title}
      {...props}
    />
  )
}

export function ActionSheetClose() {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      asChild
    >
      <button type="button" className={css.close}><IconClose /></button>
    </DialogPrimitive.Close>
  )
}
