'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Menu,
    X,
    ShieldCheck,
    ChevronDown,
    Flame,
    Users,
    Ticket,
    Briefcase,
    Info
} from 'lucide-react';
import styles from './Header.module.css';
import { Button } from '../ui/Button';
import logoImg from '@/app/public/sjobadet-logo.png';

interface NavLink {
    label: string;
    href: string;
    views?: number;
}

interface HeaderViewProps {
    isAdmin: boolean;
    isMaintenanceMode?: boolean;
    saunaLinks?: NavLink[];
    infoLinks?: NavLink[];
}

interface MainNavLink extends NavLink {
    icon?: React.ReactNode;
    dropdown?: NavLink[];
}

export function HeaderView({
    isAdmin,
    isMaintenanceMode = false,
    saunaLinks = [],
    infoLinks = []
}: HeaderViewProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [clientIsAdmin, setClientIsAdmin] = useState(isAdmin);

    // Mobile accordion states
    const [mobileSaunaOpen, setMobileSaunaOpen] = useState(false);
    const [mobileInfoOpen, setMobileInfoOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/auth/session', { cache: 'no-store' })
            .then((res) => res.ok ? res.json() as Promise<{ isAdmin: boolean }> : { isAdmin })
            .then((data) => {
                if (!cancelled && typeof data?.isAdmin === 'boolean') {
                    setClientIsAdmin(data.isAdmin);
                }
            })
            .catch(() => { /* ignore */ });
        return () => { cancelled = true; };
    }, [isAdmin]);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const mainLinks: MainNavLink[] = [
        { href: '/#saunas', label: 'Badstuer', icon: <Flame size={20} />, dropdown: saunaLinks },
        { href: '/medlemskap', label: 'Medlemskap', icon: <Users size={20} /> },
        { href: '/gavekort', label: 'Gavekort', icon: <Ticket size={20} /> },
        { href: '/bedrift', label: 'Bedrift', icon: <Briefcase size={20} /> },
        { href: '/info', label: 'Info', icon: <Info size={20} />, dropdown: infoLinks },
    ];

    const adminLink = clientIsAdmin ? (
        <Link href="/admin" className={`${styles.navLink} ${styles.adminLink}`} style={{ color: '#2563eb', fontWeight: '600' }}>
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
                    {mainLinks.map((link) => {
                        if (isMaintenanceMode && link.href !== '/') {
                            return (
                                <div key={link.label} className={styles.navLink} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                    {link.label}
                                </div>
                            );
                        }

                        if (link.dropdown && link.dropdown.length > 0) {
                            return (
                                <div key={link.label} className={styles.dropdownContainer}>
                                    <Link href={link.href} className={styles.navLink}>
                                        {link.label}
                                        <ChevronDown size={14} className={styles.chevron} />
                                    </Link>
                                    <div className={styles.dropdownMenu}>
                                        {link.dropdown.map(item => (
                                            <Link key={item.href} href={item.href} className={styles.dropdownItem}>
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link key={link.href} href={link.href} className={styles.navLink}>
                                {link.label}
                            </Link>
                        );
                    })}
                    {adminLink}
                    <Button href="https://minside.periode.no/landing/aZNzpP9Mk1XohfwTswm1/0" external variant="outline" style={{ marginLeft: '1rem' }}>
                        Min Side
                    </Button>
                </nav>

                {/* Mobile Menu Button */}
                <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu">
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Redesigned Premium Mobile Nav */}
                <nav className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                    {/* Zone 1: Sticky Header */}
                    <div className={styles.mobileMenuHeader}>
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileLogo}>
                            <Image
                                src={logoImg}
                                alt="Sjøbadet Logo"
                                height={32}
                                style={{ objectFit: 'contain', width: 'auto' }}
                                priority
                            />
                        </Link>
                        <button className={styles.closeBtn} onClick={toggleMenu} aria-label="Lukk meny">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Zone 2: Scrollable Content */}
                    <div className={styles.mobileScrollArea}>
                        <div className={styles.mobileLinks}>
                            {mainLinks.map((link) => {
                                const hasDropdown = link.dropdown && link.dropdown.length > 0;
                                const isSauna = link.label === 'Badstuer';
                                const isOpen = isSauna ? mobileSaunaOpen : mobileInfoOpen;
                                const setOpen = isSauna ? setMobileSaunaOpen : setMobileInfoOpen;

                                return (
                                    <div key={link.label} className={styles.mobileLinkWrapper}>
                                        <div className={styles.mobileLinkRow}>
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={styles.mobileLink}
                                            >
                                                {link.icon && <span className={styles.linkIcon}>{link.icon}</span>}
                                                {link.label}
                                            </Link>
                                            {hasDropdown && (
                                                <button
                                                    onClick={() => setOpen(!isOpen)}
                                                    className={styles.mobileToggle}
                                                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                                                    aria-label={isOpen ? 'Lukk undermeny' : 'Åpne undermeny'}
                                                >
                                                    <ChevronDown size={22} />
                                                </button>
                                            )}
                                        </div>

                                        {(hasDropdown && isOpen) && (
                                            <div className={styles.mobileAccordion}>
                                                {link.dropdown?.map(item => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={styles.mobileAccordionLink}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {clientIsAdmin && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`${styles.mobileLinkRow} ${styles.mobileAdmin}`}
                                >
                                    <div className={styles.mobileLink}>
                                        <ShieldCheck size={20} />
                                        Admin
                                    </div>
                                    <span className={styles.adminBadge}>Admin Panel</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Zone 3: Pinned Footer */}
                    <div className={styles.mobileFooter}>
                        <Button href="https://minside.periode.no/landing/aZNzpP9Mk1XohfwTswm1/0" external variant="primary" fullWidth>
                            Min Side
                        </Button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
