import { useContext, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import Crypto, { type Keystore } from '@lubankit/crypto'
import { Storage } from '@luban/wallet-storage'
import Button from '../../components/button'
import { I18nContext } from '../../contexts/I18nContext'
import HaloShader from '../../components/shader'
import Input from '../../components/input'
import { LOCAL_KEYSTORE, MEM_PWD } from '../../configs/constant'

import css from './index.module.css'
import MsgHelper from '../../helpers/MsgHelper'

export default function Unlock() {
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { t } = useContext(I18nContext)!
  const [password, setPassword] = useState('')
  const [searchParams] = useSearchParams()

  const backUrl = searchParams.get('url')
  const dark = document.documentElement.classList.contains('dark')

  const changePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const login = async () => {
    try {
      setLoading(true)

      const vault = await Storage.getInstance<Keystore>('local').get(LOCAL_KEYSTORE)
      const data = await Crypto.getInstance().decrypt(vault!, password)
      if (data === '') {
        toast.error(t('common.msg.password.error'))
        return
      }

      MsgHelper.memSet(MEM_PWD, password)

      nav(backUrl === null ? '/home' : backUrl)
    } catch (e) {
      console.error(e)
    }
  }

  const goReset = () => {
    nav('/forget-password')
  }

  return (
    <>
      <HaloShader dark={dark} />
      <section className={css.wrapper}>
        <div className={css.top}>
          <img src="/logo.png" width="128" height="128" />
          <h2 className={css.brand}>{t('common.brand.title')}</h2>
          <p className={css.desc}>{t('common.brand.desc')}</p>
        </div>
        <div className={css.bottom}>
          <Input type="password" onChange={changePwd} />
          <Button disabled={loading || password === ''} variant='primary' onClick={login}>{t('common.text.unlock')}</Button>
          <Button variant="ghost" onClick={goReset}>{t('common.text.forgetpassword')}</Button>
        </div>
      </section>
    </>
  )
}
