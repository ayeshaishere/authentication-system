"use client"

import { Label } from "./Label"

export function FormInput({ id, name, type = "text", value, onChange, label, placeholder, error, className = "" }) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        style={{ backgroundColor: "white" }}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
