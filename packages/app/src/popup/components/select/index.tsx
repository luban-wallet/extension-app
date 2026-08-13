import { useEffect, useRef, useState } from 'react'
import { Root, Trigger, Value, Icon, Portal, Content, Viewport, Item, ItemText, ItemIndicator } from "@radix-ui/react-select"
import IconDown from '../icons/down'
import CheckIcon from '../check-icon'

import css from './index.module.css'

type SelectProps = React.ComponentProps<typeof Root> & {
  children: React.ReactNode
  placeholder?: string
  side?: "top" | "bottom"
}

export default function Select(props: SelectProps) {
  const { children, placeholder, side = 'bottom', ...others } = props
  const ref = useRef<HTMLButtonElement | null>(null)
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setWidth(rect.width)
    }
  }, [])

  return (
    <Root {...others}>
      <Trigger ref={ref} className={css.selectTrigger}>
        <Value placeholder={placeholder} />
        <Icon>
          <IconDown width={16} height={16} />
        </Icon>
      </Trigger>
      <Portal>
        <Content
          className={css.selectContent}
          // position="popper"
          side={side}
          style={{width: width + 'px'}}
        >
          <Viewport className={css.selectViewport}>{children}</Viewport>
        </Content>
      </Portal>
    </Root>
  )
}

export const SelectItem = (props: { children: React.ReactNode, value: string }) => {
		return (
			<Item className={css.selectItem} value={props.value}>
				<ItemText>{props.children}</ItemText>
				<ItemIndicator>
					<CheckIcon />
				</ItemIndicator>
			</Item>
		)
}
