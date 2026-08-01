import { useContext } from "react"
import { toast } from "sonner"
import { copyText } from "../../utils/util"
import Button from "../button"
import IconCopy from "../icons/copy"
import { I18nContext } from "../../contexts/I18nContext"

import css from './index.module.css'

interface IProps {
  size: number
  value: string
}

export default function CopyText(props: IProps) {
  const { size } = props
  const { t } = useContext(I18nContext)!

  const copy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    await copyText(props.value)
    toast.success(t('common.msg.copy.ok'))
  }

  return (
    <Button
      variant="ghost"
      className={css.btn}
      style={{width: `${size}px`, height: `${size}px`}}
      onClick={copy}
    >
      <IconCopy width={props.size - 4} height={props.size - 4} />
    </Button>
  )
}
