import type { INetwork } from "../../../configs/network"
import { useContext } from "react"
import { useNavigate } from "react-router"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import Container from "../../../components/container"
import { Form, FormItem } from "../../../components/form"
import Input from "../../../components/input"
import Footer from "../../../components/footer"
import Button from "../../../components/button"
import NetworkDao from "../../../dao/NetworkDao"
import Select, { SelectItem } from "../../../components/select"

export default function NetworkAdd() {
  const { t } = useContext(I18nContext)!
  const nav = useNavigate()

  const submitForm = async () => {
    const form = document.getElementById('network_form') as HTMLFormElement
    const formData = new FormData(form)

    const data: INetwork = {
      chainId: '',
      icon: '',
      name: '',
      symbol: '',
      rpc: '',
      explorer: '',
      testnet: '0',
      chainType: "EVM"
    }

    // Fix testnet type
    for(const pair of formData.entries()) {
      // @ts-expect-error todo
      data[pair[0]] = pair[1]
    }
    // console.log(data)

    await new NetworkDao().insert(data)
    nav(-1)
  }

  return (
    <>
      <Pageheader title={t('page.addnetwork.header')} />

      <Container footer>
        <Form id="network_form">
          <FormItem label={t('page.settings.network.edit.label.chainid')}>
            <Input autoComplete="off" name="chainId" />
          </FormItem>
          <FormItem label={t('page.settings.network.edit.label.icon')}>
            <Input autoComplete="off" name="icon" />
          </FormItem>
          <FormItem label={t('page.settings.network.edit.label.name')}>
            <Input autoComplete="off" name="name" />
          </FormItem>
          <FormItem label={t('page.settings.network.edit.label.symbol')}>
            <Input autoComplete="off" name="symbol" />
          </FormItem>
          <FormItem label={t('page.settings.network.edit.label.rpc')}>
            <Input autoComplete="off" name="rpc" />
          </FormItem>
          <FormItem label={t('page.settings.network.edit.label.explorer')}>
            <Input autoComplete="off" name="explorer" />
          </FormItem>
          <FormItem label={t('page.settings.network.edit.label.testnet')}>
            <Select name="testnet">
              <SelectItem value="0">No</SelectItem>
              <SelectItem value="1">Yes</SelectItem>
            </Select>
          </FormItem>
          <FormItem label={t('page.settings.network.edit.label.chaintype')}>
            <Select name="chainType" side="top">
              <SelectItem value="EVM">EVM</SelectItem>
            </Select>
          </FormItem>
        </Form>
      </Container>

      <Footer>
        <Button variant="primary" onClick={submitForm}>{t('page.settings.network.edit.btn')}</Button>
      </Footer>
    </>
  )
}
