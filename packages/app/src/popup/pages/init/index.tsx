import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Storage } from '@luban/wallet-storage'
import Button from '../../components/button'
import { I18nContext } from '../../contexts/I18nContext'
import HaloShader from '../../components/shader'
import { LOCAL_CURRENT_ACCOUNT, MEM_PWD } from '../../configs/constant'
import MsgHelper from '../../helpers/MsgHelper'
import NavHelper from '../../helpers/NavHelper'
import { log } from '../../utils/debug'

import css from './init.module.css'

const TAG = '[init]'

export default function Init() {
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()
  const { t } = useContext(I18nContext)!

  const dark = document.documentElement.classList.contains('dark')

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      const inited = await Storage.getInstance('local').get(LOCAL_CURRENT_ACCOUNT)
      log(TAG, 'check inited: ', inited)
      if(inited) {
        const pwd = await MsgHelper.memGet<string>(MEM_PWD)
        if(pwd === '') {
          nav('/unlock')
        } else {
          nav('/home')
        }
        return
      }
      setLoading(false)
    } catch(e) {
      console.error('init db error: ', e)
    }
  }

  const goCreate = () => {
    NavHelper.nav(nav, '/create-wallet')
  }
  const goImport = () => {
    nav('/import-wallet')
  }

  log(TAG, 'init page render')

  if(loading) {
    return null;
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
          <Button disabled={loading} variant='primary' onClick={goCreate}>{t('page.init.btn.create')}</Button>
          <Button disabled={loading} variant='secondary' onClick={goImport}>{t('page.init.btn.import')}</Button>
        </div>
      </section>
    </>
  )
}
