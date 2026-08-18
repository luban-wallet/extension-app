import { useState } from "react"
import { toast } from "sonner"
import Crypto from "@lubankit/crypto"
import Pageheader from "../../components/page-header"
import Container from "../../components/container"
import { Form, FormItem } from "../../components/form"
import Input, { Textarea } from "../../components/input"
import Footer from "../../components/footer"
import Button from "../../components/button"
import Alert from "../../components/alert"
import SwitchTab, { type SwitchItem } from "../../components/switch-tab"

export default function Tool() {
  const [tab, setTab] = useState(1)
  const [result, setResult] = useState('')

  const changeTab = (item: SwitchItem) => {
    setTab(item.value)
    setResult('')
  }

  const getValue = (): Promise<{password: string, key: string}> => {
    return new Promise((resolve, reject) => {
      const form = document.getElementById('tool') as HTMLFormElement
      const formData = new FormData(form)
      const password = formData.get('password') as string
      const key = formData.get('key')

      // Text
      if(tab === 1) {
        resolve({ password: password.trim(), key: (key as string).trim() })
        return
      }

      // File
      const reader = new FileReader()
      reader.onload = () => {
        const v = reader.result as string
        resolve({ password: password.trim(), key: v.trim() })
      }
      reader.onerror = () => {
        reject(reader.error)
      }
      reader.readAsText(key as File)
    })
  }

  const encryptKey = async () => {
    try {
      const { password, key } = await getValue()
      if(password === '' || key === '') {
        return
      }

      const str = await Crypto.getInstance().encrypt(key, password)
      setResult(JSON.stringify(str))
    } catch(e) {
      toast.error((e as Error).message)
    }
  }

  const decryptKey = async () => {
    try {
      const { password, key } = await getValue()
      if(password === '' || key === '') {
        return
      }

      const data = key.replace(/\s+/g, '')
      const keyJson = JSON.parse(data)
      const str = await Crypto.getInstance().decrypt(keyJson, password)
      setResult(str === '' ? 'Error' : str)
    } catch(e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <>
      <Pageheader title="Keystore Tool" />
      <Container>
        <Form id="tool">
          <FormItem label="Password">
            <Input
              type="password"
              name="password"
              autoComplete="off"
            />
          </FormItem>
          <FormItem label="Message">
            <SwitchTab
              value={tab}
              onChange={changeTab}
              items={[
                {value: 1, label: 'Text'},
                {value: 2, label: 'Wallet File'},
              ]}
            />
            {
              tab === 1 ? (
                <Textarea autoComplete="off" name="key" rows={6} />
              ) : (
                <input
                  type="file"
                  name="key"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '20px 12px',
                    fontSize: '12px',
                    backgroundColor: 'rgb(var(--color-background-200))',
                    borderRadius: 'var(--radius)',
                  }}
                />
              )
            }
          </FormItem>
        </Form>
        {result !== '' ? <div style={{marginTop: '12px'}}><Alert>{result}</Alert></div> : null}
      </Container>

      <Footer>
        <Button onClick={encryptKey}>Encrypt</Button>
        <Button variant="primary" onClick={decryptKey}>Try Decrypt</Button>
      </Footer>
    </>
  )
}
