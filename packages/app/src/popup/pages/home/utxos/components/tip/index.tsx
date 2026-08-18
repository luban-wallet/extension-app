import { useState } from "react"
import IconHelp from "../../../../../components/icons/help"
import Button from "../../../../../components/button"
import { Dialog, DialogContent } from "../../../../../components/dialog"
import Alert from "../../../../../components/alert"

export default function Tip() {
  const [show, setShow] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        style={{width: '28px', height: '28px', borderRadius: 'var(--radius)'}}
        onClick={() => setShow(true)}
      >
        <IconHelp width={16} height={16} />
      </Button>

      {
        show ? (
          <Dialog open={true} onOpenChange={() => setShow(false)}>
            <DialogContent title="Notice">
              <p style={{marginBottom: '12px', fontSize: '14px', marginTop: '8px', lineHeight: '1.5'}}>
                锁定功能只针对本钱包起作用，锁定后的 utxo 在使用本钱包进行支付时不会被使用，
              </p>
              <Alert type="warning">
                注意：锁定 utxo 后，其他钱包仍然可以使用这些 utxo 进行支付。
              </Alert>
            </DialogContent>
          </Dialog>
        ) : null
      }
    </>
  )
}
