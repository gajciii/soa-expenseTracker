import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { navbarStyles, navbarClasses } from '../styles/navbarStyles';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

export const Navbar = () => {
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();
  const isExpenses = location.pathname === '/expenses';
  const isReports = location.pathname === '/reports';

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav 
      className={navbarClasses.nav}
      style={navbarStyles.nav}
    >
      <div className={navbarClasses.container}>
        <Link to="/expenses" className={navbarClasses.logoLink} style={navbarStyles.logoLink}>
          <img src={logo} alt="Expense Tracker Logo" className={navbarClasses.logo} style={navbarStyles.logo} />
        </Link>
        <div className={navbarClasses.linksContainer}>
          <div className={navbarClasses.linksWrapper}>
            <Link
              to="/expenses"
              className={navbarClasses.link(isExpenses)}
              style={navbarStyles.link(isExpenses)}
            >
              Expenses
            </Link>
            <Link
              to="/reports"
              className={navbarClasses.link(isReports)}
              style={navbarStyles.link(isReports)}
            >
              Reports
            </Link>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};
