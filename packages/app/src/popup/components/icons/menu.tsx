export default function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M128 160h768v64H128v-64zM128 480h768v64H128v-64zM128 800h768v64H128v-64z"
        fill="currentColor"
      ></path>
    </svg>
  )
}