import { Dialog, DialogContent } from "../../../../components/dialog"
import ContactList from "./index"

interface IProps {
  show: boolean
  onClose: () => void
  onSelect: (address: string) => void
}

export default function ContactDialog(props: IProps) {

  const select = (e: React.MouseEvent<HTMLDivElement>) => {
    const address = (e.target as HTMLDivElement).getAttribute("data-address")
    if(address !== null) {
      props.onSelect(address)
    }
    props.onClose()
  }

  return (
    <Dialog open={props.show} onOpenChange={props.onClose}>
      <DialogContent title="">
        <ContactList onSelect={select} />
      </DialogContent>
    </Dialog>
  )
}