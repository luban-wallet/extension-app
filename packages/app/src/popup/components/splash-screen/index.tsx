import css from './index.module.css'

export default function SplashScreen() {
  return (
    <div className={css.wrapper}>
      <div className={css.inner}>
        <div className={css.animate}>
          <img alt="splash screen" src="/logo.png" width="100%" height="100%" />
        </div>
        <div className={css.shadow} />
      </div>
    </div>
  )
}