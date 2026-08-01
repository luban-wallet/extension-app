import { useContext } from "react"
import Divider from "../../../components/divider"
import IconAccount from "../../../components/icons/account"
import IconLanguage from "../../../components/icons/language"
// import IconLight from "../../../components/icons/light"
import IconMoon from "../../../components/icons/moon"
import IconNetwork from "../../../components/icons/network"
import IconSafe from "../../../components/icons/safe"
import LinkGroup, { LinkItem } from "../../../components/link-group"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import IconWarn from "../../../components/icons/warn"
import IconLink from "../../../components/icons/link"

import css from './index.module.css'

export default function Settings() {
  const { t } = useContext(I18nContext)!

  return (
    <>
      <Pageheader title={t('page.settings.header')} />

      <div className={css.content}>
        <LinkGroup>
          <LinkItem
            link="/home/settings/backup"
            icon={<IconSafe width={20} height={20} />}
            label={t('page.settings.label.mnemonic')}
            showArrow
          />
          <Divider />
          <LinkItem
            link="/home/settings/account"
            icon={<IconAccount width={20} height={20} />}
            label={t('page.settings.label.accounts')}
            showArrow
          />
          <Divider />
          <LinkItem
            link="/home/settings/network"
            icon={<IconNetwork width={20} height={20} />}
            label={t('page.settings.label.networks')}
            showArrow
          />
          <Divider />
          <LinkItem
            link="/home/settings/connections"
            icon={<IconLink width={20} height={20} />}
            label={t('page.settings.label.connections')}
            showArrow
          />
        </LinkGroup>
        <LinkGroup>
          <LinkItem
            link="/home/settings/language"
            icon={<IconLanguage width={20} height={20} />}
            label={t('page.settings.label.language')}
            showArrow
          />
          <Divider />
          <LinkItem
            link="/home/settings/theme"
            icon={<IconMoon width={20} height={20} />}
            label={t('page.settings.label.theme')}
            showArrow
          />
        </LinkGroup>
        <LinkGroup>
          <LinkItem
            link="/home/settings/about"
            icon={<IconWarn width={20} height={20} />}
            label={t('page.settings.label.about')}
            showArrow
          />
        </LinkGroup>
      </div>
    </>
  )
}
