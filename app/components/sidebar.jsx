'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState , useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [avatar, setAvatar] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);

    useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      const storedAvatar = localStorage.getItem('profileImage');
      if (storedName) setUserName(storedName);
      if (storedEmail) {
        setUserEmail(storedEmail);
        console.log('Sidebar initial email load:', storedEmail);
      }
      // Only use avatar if it's a valid base64 data URL or regular URL (not a blob URL)
      if (storedAvatar && !storedAvatar.startsWith('blob:')) {
        setAvatar(storedAvatar);
      } else {
        setAvatar(null);
      }
    } catch (err) {
      console.error('Error loading initial user data in sidebar:', err);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const localToken = localStorage.getItem('token');
        const sessionToken = sessionStorage.getItem('token');
        setIsAuthenticated(Boolean(localToken || sessionToken));
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
    
    const updateUserData = () => {
      checkAuth();
      try {
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');
        const storedAvatar = localStorage.getItem('profileImage');
        
        // Always update if data exists, even if empty string
        if (storedName) setUserName(storedName);
        if (storedEmail) {
          setUserEmail(storedEmail);
          console.log('Sidebar email updated:', storedEmail);
        }
        // Only use avatar if it's a valid base64 data URL or regular URL (not a blob URL)
        if (storedAvatar && !storedAvatar.startsWith('blob:')) {
          setAvatar(storedAvatar);
        } else {
          setAvatar(null);
        }
      } catch (err) {
        console.error('Error updating user data in sidebar:', err);
      }
    };
    
    // Initial load of user data
    updateUserData();
    
    // Listen for storage events (cross-window)
    window.addEventListener('storage', updateUserData);
    // Listen for custom profile update events (same window)
    window.addEventListener('profileUpdated', updateUserData);
    // Listen for login events (same window) - for Google login
    window.addEventListener('userLoggedIn', updateUserData);
    
    return () => {
      window.removeEventListener('storage', updateUserData);
      window.removeEventListener('profileUpdated', updateUserData);
      window.removeEventListener('userLoggedIn', updateUserData);
    };
  }, []);

  const guestNavItems = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/demoexercise', label: 'Demo Exercise' },
    { href: '/auth', label: 'Auth' },
  ];

  const authenticatedNavItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/modules', label: 'Modules' },
    { href: '/lessons', label: 'Lessons' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/profile', label: 'Profile' },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : guestNavItems;

  // Handle logout
  const handleLogout = () => {
    try {
      // Clear tokens
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Clear user data
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('profileImage');
      
      // Reset state
      setIsAuthenticated(false);
      setUserName('User');
      setUserEmail('user@example.com');
      setAvatar(null);
      setShowUserMenu(false);
      setShowMobileUserMenu(false);
      
      // Redirect to auth page
      window.location.href = '/auth';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 h-screen sticky top-0 z-40">
        <div className="flex items-center justify-center py-4 pr-6 border-b border-gray-200">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/logo.png"
              alt="Fluent Flow Logo"
              width={160}
              height={160}
              priority
              className="object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
               active={
                item.href === '/'
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              }

            />
          ))}
        </div>

        <div className="px-4 py-4 border-t border-gray-200">
          {isAuthenticated ? (
            <div>
              <div 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 px-4 py-3 rounded_cstm bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{userName?.[0] || 'U'}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {showUserMenu && (
                <div className="mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth">
              <div className="w-full bg-blue-900 text-white text-center font-semibold py-3 rounded-xl hover:bg-blue-800 transition-all duration-200">
                Sign In
              </div>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Top Navbar */}
      <nav className="lg:hidden absolute right-0 top-0 w-full bg-white/50 backdrop-blur-md z-[12]">
        <div className="flex items-center justify-between px-4 py-1">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>
          <button
            className="text-gray-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar and Backdrop (with transitions) */}
      <div>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`fixed top-0 right-0 w-64 h-full bg-white z-50 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
            />
            <button onClick={() => setMobileMenuOpen(false)}>
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <SidebarLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={pathname === item.href}
              />
            ))}
          </div>

            <div className="px-4 py-4 border-t border-gray-200 mt-auto">
            {isAuthenticated ? (
              <div>
                <div 
                  onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
                  className="flex items-center space-x-3 px-4 py-3 rounded_cstm bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{userName?.[0] || 'U'}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${showMobileUserMenu ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {showMobileUserMenu && (
                  <div className="mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth">
                <div className="w-full bg-blue-900 text-white text-center font-semibold py-3 rounded-xl hover:bg-blue-800 transition-all duration-200">
                  Sign In
                </div>
              </Link>
            )}
          </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function SidebarLink({ href, label, active = false }) {
  const baseClasses =
    'flex items-center px-4 py-3 text-sm font-medium rounded_cstm transition-all duration-200 mb-2';
  const activeClasses = 'text-white bg-blue-900 hover:bg-blue-800';
  const inactiveClasses = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

  const iconMap = {
    Home: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    Features: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    'Demo Exercise': (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6.253v13M12 6.253C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253M12 6.253C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    Modules: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6.253v13M12 6.253C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253M12 6.253C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    Dashboard: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    Lessons: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
        />
      </svg>
    ),
    Leaderboard: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
    Auth: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    Profile: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  };

  return (
    <Link href={href}>
      <div className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
        {iconMap[label]}
        {label}
      </div>
    </Link>
  );
}
