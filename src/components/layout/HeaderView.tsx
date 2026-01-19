'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShieldCheck } from 'lucide-react';
import styles from './Header.module.css';
import { Button } from '../ui/Button';
import logoImg from '@/app/public/sjobadet-logo.png';

interface HeaderViewProps {
    isAdmin: boolean;
}

export function HeaderView({ isAdmin }: HeaderViewProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navLinks = [
        { href: '/#saunas', label: 'Badstuer' },
        { href: '/medlemskap', label: 'Medlemskap' },
        { href: '/gavekort', label: 'Gavekort' },
        { href: '/bedrift', label: 'Bedrift' },
        { href: '/info', label: 'Info' },
    ];

    const adminLink = isAdmin ? (
        <Link href="/admin" className={`${styles.navLink} ${styles.adminLink}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: '600' }}>
            <ShieldCheck size={18} />
            Admin
        </Link>
    ) : null;

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src={logoImg}
                        alt="Sjøbadet Logo"
                        height={40}
                        style={{ objectFit: 'contain', width: 'auto' }}
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className={styles.nav}>
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={styles.navLink}>
                            {link.label}
                        </Link>
                    ))}
                    {adminLink}
                    <Button href="https://minside.periode.no/landing/aZNzpP9Mk1XohfwTswm1/0" external variant="outline" style={{ marginLeft: '1rem' }}>
                        Min Side
                    </Button>
                </nav>

                {/* Mobile Menu Button */}
                <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu">
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Nav */}
                <nav className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                    <div className={styles.mobileTopRow}>
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileLogo}>
                            <Image
                                src={logoImg}
                                alt="Sjøbadet Logo"
                                height={34}
                                style={{ objectFit: 'contain', width: 'auto' }}
                                priority
                            />
                        </Link>
                        <button className={styles.closeBtn} onClick={toggleMenu} aria-label="Lukk meny">
                            <X size={26} />
                        </button>
                    </div>

                    <div className={styles.mobileLinks}>
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileLink}>
                                {link.label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.mobileLink} ${styles.mobileAdmin}`}>
                                <ShieldCheck size={20} />
                                Admin
                            </Link>
                        )}
                    </div>

                    <div className={styles.mobileCta}>
                        <Button href="https://minside.periode.no/landing/aZNzpP9Mk1XohfwTswm1/0" external variant="outline" fullWidth>
                            Min Side
                        </Button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
