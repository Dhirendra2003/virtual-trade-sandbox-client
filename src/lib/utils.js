import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getColors(letter) {
  const colors = {
    a: 'bg-red-200 text-red-600 dark:bg-red-600 dark:text-red-200',
    b: 'bg-green-200 text-green-600 dark:bg-green-600 dark:text-green-200',
    c: 'bg-blue-200 text-blue-600 dark:bg-blue-600 dark:text-blue-200',
    d: 'bg-yellow-200 text-yellow-600 dark:bg-yellow-600 dark:text-yellow-200',
    e: 'bg-purple-200 text-purple-600 dark:bg-purple-600 dark:text-purple-200',
    f: 'bg-pink-200 text-pink-600 dark:bg-pink-600 dark:text-pink-200',
    g: 'bg-orange-200 text-orange-600 dark:bg-orange-600 dark:text-orange-200',
    h: 'bg-indigo-200 text-indigo-600 dark:bg-indigo-600 dark:text-indigo-200',
    i: 'bg-teal-200 text-teal-600 dark:bg-teal-600 dark:text-teal-200',
    j: 'bg-cyan-200 text-cyan-600 dark:bg-cyan-600 dark:text-cyan-200',
    k: 'bg-red-200 text-red-600 dark:bg-red-600 dark:text-red-200',
    l: 'bg-green-200 text-green-600 dark:bg-green-600 dark:text-green-200',
    m: 'bg-blue-200 text-blue-600 dark:bg-blue-600 dark:text-blue-200',
    n: 'bg-yellow-200 text-yellow-600 dark:bg-yellow-600 dark:text-yellow-200',
    o: 'bg-purple-200 text-purple-600 dark:bg-purple-600 dark:text-purple-200',
    p: 'bg-pink-200 text-pink-600 dark:bg-pink-600 dark:text-pink-200',
    q: 'bg-orange-200 text-orange-600 dark:bg-orange-600 dark:text-orange-200',
    r: 'bg-indigo-200 text-indigo-600 dark:bg-indigo-600 dark:text-indigo-200',
    s: 'bg-teal-200 text-teal-600 dark:bg-teal-600 dark:text-teal-200',
    t: 'bg-cyan-200 text-cyan-600 dark:bg-cyan-600 dark:text-cyan-200',
    u: 'bg-red-200 text-red-600 dark:bg-red-600 dark:text-red-200',
    v: 'bg-green-200 text-green-600 dark:bg-green-600 dark:text-green-200',
    w: 'bg-blue-200 text-blue-600 dark:bg-blue-600 dark:text-blue-200',
    x: 'bg-yellow-200 text-yellow-600 dark:bg-yellow-600 dark:text-yellow-200',
    y: 'bg-purple-200 text-purple-600 dark:bg-purple-600 dark:text-purple-200',
    z: 'bg-pink-200 text-pink-600 dark:bg-pink-600 dark:text-pink-200',
  }
  return colors[letter?.toLowerCase()] || 'bg-gray-200 text-gray-600'
}
