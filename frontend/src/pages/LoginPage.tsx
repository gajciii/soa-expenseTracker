import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { pageStyles, pageClasses } from '../styles/pageStyles';
import { loginPageStyles } from '../styles/loginPageStyles';

export const LoginPage = () => {
  const { isAuthenticated, loading, login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/expenses', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login({ username, password });
      showNotification('Login successful!', 'success');
      navigate('/expenses');
    } catch (error: any) {
      showNotification(error.message || 'Login failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={pageClasses.container} style={loginPageStyles.container}>
      <Card>
        <div style={loginPageStyles.cardContent}>
          <h1 style={pageStyles.title}>Login</h1>
          <p style={pageStyles.subtitle}>Sign in to your account</p>
          <form onSubmit={handleSubmit} style={loginPageStyles.form}>
            <div style={loginPageStyles.inputWrapper}>
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
            <div style={loginPageStyles.inputWrapper}>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} style={loginPageStyles.submitButton}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div style={loginPageStyles.footer}>
            <p style={loginPageStyles.footerText}>
              Don't have an account?{' '}
              <Link to="/register" style={loginPageStyles.footerLink}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

