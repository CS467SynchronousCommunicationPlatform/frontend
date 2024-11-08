/**
 * Represents a Link to a page
 * To be used with the NavBar component
 */

"use client"

import Link from 'next/link'

type NavItemProps = {
    href: string
    children: React.ReactNode
}

export function NavItem({ href, children }: NavItemProps) {

    return (
        <Link href={href} className='block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"'>{children}</Link>
    )
}