import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { navbarStyles, navbarClasses } from '../styles/navbarStyles';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

export const Navbar = () => {
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isExpenses = location.pathname === '/expenses';
  const isNotifications = location.pathname === '/notifications';
  const isBudgets = location.pathname === '/budgets';
  const isAnalytics = location.pathname === '/analytics';
  const isSubscriptions = location.pathname === '/subscriptions';
  const isSharedExpenses = location.pathname === '/shared-expenses';

  if (!isAuthenticated) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav 
      className={navbarClasses.nav}
      style={navbarStyles.nav}
    >
      <div className={navbarClasses.container}>
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link to="/expenses" className={navbarClasses.logoLink} style={navbarStyles.logoLink}>
            <img src={logo} alt="Expense Tracker Logo" className={navbarClasses.logo} style={navbarStyles.logo} />
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="sm:hidden p-2 rounded-lg"
            style={{ color: 'var(--color-text-white)' }}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
        
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto mt-4 sm:mt-0`}>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
            <Link
              to="/expenses"
              className={navbarClasses.link(isExpenses)}
              style={navbarStyles.link(isExpenses)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Expenses
            </Link>
            <Link
              to="/budgets"
              className={navbarClasses.link(isBudgets)}
              style={navbarStyles.link(isBudgets)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Budgets
            </Link>
            <Link
              to="/subscriptions"
              className={navbarClasses.link(isSubscriptions)}
              style={navbarStyles.link(isSubscriptions)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Subscriptions
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/analytics"
              className={navbarClasses.iconLink(isAnalytics)}
              style={navbarStyles.link(isAnalytics)}
              title="Analytics"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
            </Link>
            <Link
              to="/shared-expenses"
              className={navbarClasses.iconLink(isSharedExpenses)}
              style={navbarStyles.link(isSharedExpenses)}
              title="Shared Expenses"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </Link>
            <Link
              to="/notifications"
              className={navbarClasses.iconLink(isNotifications)}
              style={navbarStyles.link(isNotifications)}
              title="Notifications"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </Link>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
