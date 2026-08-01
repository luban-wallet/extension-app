import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

import css from './index.module.css'

export function DropdownMenu(props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  const { children, ...others } = props
  return <DropdownMenuPrimitive.Root data-slot="dropdownMenu" {...others}>{children}</DropdownMenuPrimitive.Root>
}

export function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdownMenuTrigger" {...props} />
}

export function DropdownMenuContent(props: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  const { children, ...others } = props
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content className={css.content} data-slot="dropdownMenuContent" {...others}>{children}</DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

export function DropdownMenuItem(props: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  const { children, ...others } = props
  return (
    <DropdownMenuPrimitive.Item className={css.item} data-slot="dropdownMenuItem" {...others}>
      {children}
    </DropdownMenuPrimitive.Item>
  )
}

export function DropdownMenuSeparator(props: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator className={css.separator} data-slot="dropdownMenuSeparator" {...props} />
}