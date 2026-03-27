import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getColors(letter) {
  const colors = {
    a: 'bg-red-200 text-red-600',
    b: 'bg-green-200 text-green-600',
    c: 'bg-blue-200 text-blue-600',
    d: 'bg-yellow-200 text-yellow-600',
    e: 'bg-purple-200 text-purple-600',
    f: 'bg-pink-200 text-pink-600',
    g: 'bg-orange-200 text-orange-600',
    h: 'bg-indigo-200 text-indigo-600',
    i: 'bg-teal-200 text-teal-600',
    j: 'bg-cyan-200 text-cyan-600',
    k: 'bg-red-200 text-red-600',
    l: 'bg-green-200 text-green-600',
    m: 'bg-blue-200 text-blue-600',
    n: 'bg-yellow-200 text-yellow-600',
    o: 'bg-purple-200 text-purple-600',
    p: 'bg-pink-200 text-pink-600',
    q: 'bg-orange-200 text-orange-600',
    r: 'bg-indigo-200 text-indigo-600',
    s: 'bg-teal-200 text-teal-600',
    t: 'bg-cyan-200 text-cyan-600',
    u: 'bg-red-200 text-red-600',
    v: 'bg-green-200 text-green-600',
    w: 'bg-blue-200 text-blue-600',
    x: 'bg-yellow-200 text-yellow-600',
    y: 'bg-purple-200 text-purple-600',
    z: 'bg-pink-200 text-pink-600',
  }
  return colors[letter?.toLowerCase()] || 'bg-gray-200 text-gray-600'
}
