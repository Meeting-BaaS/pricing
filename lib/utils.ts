import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEnvVar(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `${key} is not defined in the environment variables. Please set it in your .env file.`
    )
  }
  return value
}
