import { useEffect, useState } from "react"
import ContactDao from "../../../../dao/ContactDao"
import type { IContact } from "../../../../configs/contact"
import { Column } from "../../../../components/container"
import ColorIcon from "../../../../components/color-icon"
import { formatAddress } from "../../../../utils/util"

import css from "./index.module.css"

interface IProps {
  onSelect: (e: React.MouseEvent<HTMLDivElement>) => void
}
export default function ContactList(props: IProps) {
  const [list, setList] = useState<IContact[] | null>(null)

  useEffect(() => {
    loadList()
  }, [])

  const loadList = async () => {
    const json = await new ContactDao().getAll()
    setList(json)
  }

  return (
    <Column onClick={props.onSelect}>
      {
        list?.map((item) => (
          <div key={item.id} className={css.item}>
            <div className={css.mask} data-address={item.address}></div>
            <div className={css.avatar}>
              <ColorIcon size={40} name={item.name} />
            </div>
            <div>
              <p className={css.name}><b>{item.name}</b></p>
              <p className={css.addr}>
                {formatAddress(item.address)}
              </p>
            </div>
          </div>
        ))
      }
    </Column>
  )
}