import type { IProps } from "./type"
import { useContext, useState } from "react"
import { FormItem } from "../../components/form"
import { I18nContext } from "../../contexts/I18nContext"
import Input from "../../components/input"
import Button from "../../components/button"

const advanced = {
  fontSize: '12px',
  cursor: 'pointer',
  width: 'auto',
  height: '20px',
  padding: '0px 8px'
}
const nonce = {
  display: 'block',
  lineHeight: '20px',
  marginBottom: '4px',
  fontWeight: 500,
}


export default function Evm(props: IProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { t } = useContext(I18nContext)!

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced)
  }

  return (
    <FormItem
      name="nonce"
      label=""
      action={
        <Button
          variant="ghost"
          style={advanced}
          onClick={toggleAdvanced}
        >{t('page.send.text.showadvanced')}</Button>
      }
    >
      {showAdvanced ? (
        <div>
          <label style={nonce}>{t('page.send.label.nonce')}</label>
          <Input
            type="text"
            value={props.value}
            onChange={props.onChange}
          />
        </div>
      ) : null}
    </FormItem>
  )
}
