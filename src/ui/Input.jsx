import { forwardRef } from "react"

const Input = forwardRef(({ className = "", type = "text", error, label, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
      <input
        type={type}
        className={`
          flex h-11 w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-slate-200
          placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 
          focus:border-teal-500 disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200 hover:border-slate-600
          ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
          ${className}
        `}
        ref={ref}
        {...props}
      />
      {error && <p className="text-sm text-red-400 flex items-center gap-1">{error}</p>}
    </div>
  )
})

Input.displayName = "Input"

export default Input
