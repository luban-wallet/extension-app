import IconAdd from "../../components/icons/add"
import LinkButton from "../../components/link-button"

export default function Evm() {
  return (
    <LinkButton style={{width: '28px', height: '28px', borderRadius: 'var(--radius)'}} to="/home/token-add">
      <IconAdd width={18} height={18} />
    </LinkButton>
  )
}
