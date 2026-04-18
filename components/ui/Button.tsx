import Link from 'next/link'
import s from './Button.module.css'

type ButtonVariant = 'primary' | 'ghost' | 'text'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  showArrow?: boolean
  className?: string
  children: React.ReactNode
}

interface ButtonAsButton extends ButtonBaseProps {
  as?: 'button'
  href?: never
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

interface ButtonAsLink extends ButtonBaseProps {
  as: 'link'
  href: string
  type?: never
  disabled?: never
  onClick?: never
}

type ButtonProps = ButtonAsButton | ButtonAsLink

function getClassNames(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return [
    s.btn,
    s[`btn--${variant}`],
    s[`btn--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export default function Button({
  variant = 'primary',
  size = 'md',
  showArrow = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classNames = getClassNames(variant, size, className)

  if (props.as === 'link') {
    const { href } = props
    return (
      <Link href={href} className={classNames}>
        {children}
        {showArrow && (
          <span className={s.btnArrow} aria-hidden="true">
            →
          </span>
        )}
      </Link>
    )
  }

  const { type = 'button', disabled, onClick } = props as ButtonAsButton
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classNames}
    >
      {children}
      {showArrow && (
        <span className={s.btnArrow} aria-hidden="true">
          →
        </span>
      )}
    </button>
  )
}
