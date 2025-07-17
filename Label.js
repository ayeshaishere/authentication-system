export function Label({ htmlFor, children, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none text-gray-700 ${className}`}>
      {children}
    </label>
  )
}
