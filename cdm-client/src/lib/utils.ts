import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function waitFor(timeout: number) {
  return await new Promise<void>((res) => setTimeout(res, timeout));
}
