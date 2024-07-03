// Path: src/components/NavBar.tsx

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";

export default function NavBar() {
    const router = useRouter();

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/create', label: 'Create' },
    ];

    return (
        <NavigationMenu>
            {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                        <Link href={item.href} passHref>
                            <NavigationMenuLink className={router.pathname === item.href ? 'text-blue-500' : ''}>
                                {item.label}
                            </NavigationMenuLink>
                        </Link>
                </NavigationMenuItem>
            ))}
        </NavigationMenu>
    );
}
