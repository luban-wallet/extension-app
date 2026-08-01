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

export default function ImportWallet() {
  const [result, setResult] = useState('')

  const getValue = (): {password: string, key: string} => {
    const form = document.getElementById('tool') as HTMLFormElement
    const formData = new FormData(form)
    const password = formData.get('password') as string
    const key = formData.get('key') as string

    return { password: password.trim(), key: key.trim() }
  }

  const encryptKey = async () => {
    const { password, key } = getValue()
    if(password === '' || key === '') {
      return
    }

    try {
      const str = await Crypto.getInstance().encrypt(key, password)
      setResult(JSON.stringify(str))
    } catch(e) {
      toast.error((e as Error).message)
    }
  }

  const decryptKey = async () => {
    const { password, key } = getValue()
    if(password === '' || key === '') {
      return
    }

    try {
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
            <Input autoComplete="off" type="password" name="password" />
          </FormItem>
          <FormItem label="Message">
            <Textarea autoComplete="off" name="key" rows={6} />
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
