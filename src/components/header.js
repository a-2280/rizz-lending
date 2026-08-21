'use client';

import { useState } from 'react';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ApplyNow from './applyNow';

const BORROW_SMART_PATHS = ['/overview', '/cash-out-refinance', '/lease-buyout'];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const pathname = usePathname();
  const isActive = (href) => pathname === href;

  return (
    <header className="masthead flex justify-center weight-500">
      <div className="flex space-between align-center w-100 max-1400">
        <div className="flex-1">
          <Link className="f-display f-25 weight-700" href="/">
            Rizz <span className="text-light-orange">Lending</span>
          </Link>
        </div>
        <nav className="nav-links flex gap-30">
          <div className='modal-parent pos-rel'>
            <Link className={`flex align-center${BORROW_SMART_PATHS.includes(pathname) ? ' active' : ''}`} href="/overview">Borrow Smart<ChevronDown size={14} /></Link>
            <div className='nav-modal'>
              <Link className={isActive('/overview') ? 'active' : undefined} href="/overview"><span>Overview</span></Link>
              <Link className={isActive('/cash-out-refinance') ? 'active' : undefined} href="/cash-out-refinance"><span>Cash-Out Refinance</span></Link>
              <Link className={isActive('/lease-buyout') ? 'active' : undefined} href="/lease-buyout"><span>Lease Buyout</span></Link>
            </div>
          </div>
          <Link href="/vehicles">Vehicles</Link>
          <Link href="/hypercar">Hypercar</Link>
          <Link href="/eligibility">Eligibility</Link>
          <Link href="/dealers">Dealers</Link>
          <Link href="/partners">Partners</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="flex-1 flex justify-end align-center gap-20">
          <Link className="account flex align-center gap-5" href="/my-account">
            <Globe size={14} />
            My Account
          </Link>
          <ApplyNow />
          <button type="button" className="burger" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <div className={`mobile-menu flex flex-col${menuOpen ? ' open' : ''}`}>
        <Link href="#" onClick={closeMenu}>Borrow Smart</Link>
        <Link href="#" onClick={closeMenu}>— Cash-Out Refinance</Link>
        <Link href="#" onClick={closeMenu}>— Lease Buyout</Link>
        <Link href="#" onClick={closeMenu}>Vehicles</Link>
        <Link href="#" onClick={closeMenu}>Hypercar</Link>
        <Link href="#" onClick={closeMenu}>Eligibility</Link>
        <Link href="#" onClick={closeMenu}>Dealers</Link>
        <Link href="#" onClick={closeMenu}>Partners</Link>
        <Link href="#" onClick={closeMenu}>About</Link>
        <Link href="#" onClick={closeMenu}>My Account</Link>
        <Link href="#" onClick={closeMenu}>Apply Now</Link>
      </div>
    </header>
  );
}
