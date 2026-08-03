import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import Button from "../../components/button"
import Footer from "../../components/footer"
import Pageheader from "../../components/page-header"
import { ToggleGroupItem, ToggleGroupRoot } from "../../components/toggle-group"
import { I18nContext } from "../../contexts/I18nContext"
import Container, { Title } from "../../components/container"
import SwitchTab, { type SwitchItem } from "../../components/switch-tab"

import css from './type.module.css'

export default function GenerateType() {
  const [count, setCount] = useState(24)
  const [method, setMethod] = useState('a')
  const nav = useNavigate()
  const { t } = useContext(I18nContext)!

  const handleChangeGenerateMethod = (value: string) => {
    setMethod(value)
  }

  const changeWordsType = (item: SwitchItem) => {
    setCount(item.value)
  }

  const handleNext = () => {
    if('a' === method) {
      nav('/create-wallet/auto?c=' + count)
      return
    }

    nav('/create-wallet/manual?c=' + count)
  }

  return (
    <>
      <Pageheader title={t('page.create.type.header')} />
      <Container>
        <Title >{t('page.create.type.wordstype.title')}</Title>
        <SwitchTab
          value={count}
          values={[
            {label: t('page.create.type.wordstype.type24'), value: 24},
            {label: t('page.create.type.wordstype.type12'), value: 12}
          ]}
          onChange={changeWordsType}
        />

        <Title style={{marginTop: '24px'}}>{t('page.create.type.title')}</Title>
        <ToggleGroupRoot
          className={css.toggleGroup}
          type="single"
          defaultValue="a"
          aria-label="Generate Method"
          onValueChange={handleChangeGenerateMethod}
        >
          <ToggleGroupItem
            className={css.toggleGroupItem}
            value="a"
            aria-label="Auto Generate"
          >
            <p className={css.toggleGroupItemTitle}>{t('page.create.type.auto.title')}</p>
            <p className={css.toggleGroupItemTitleDesc}>{t('page.create.type.auto.desc')}</p>
          </ToggleGroupItem>
          <ToggleGroupItem
            className={css.toggleGroupItem}
            value="m"
            aria-label="Manual Generate"
          >
            <p className={css.toggleGroupItemTitle}>{t('page.create.type.manual.title')}</p>
            <p className={css.toggleGroupItemTitleDesc}>{t('page.create.type.manual.desc')}</p>
          </ToggleGroupItem>
        </ToggleGroupRoot>
      </Container>
      <Footer>
        <Button variant="primary" onClick={handleNext}>{t('common.text.next')}</Button>
      </Footer>
    </>
  )
}
