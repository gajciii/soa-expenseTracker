import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { pageStyles, pageClasses } from '../styles/pageStyles';
import { registerPageStyles } from '../styles/registerPageStyles';

export const RegisterPage = () => {
  const { isAuthenticated, loading, register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/expenses', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || isAuthenticated) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined,
      });
      showNotification('Registration successful!', 'success');
      navigate('/expenses');
    } catch (error: any) {
      showNotification(error.message || 'Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={pageClasses.container} style={registerPageStyles.container}>
      <Card>
        <div style={registerPageStyles.cardContent}>
          <h1 style={pageStyles.title}>Register</h1>
          <p style={pageStyles.subtitle}>Create a new account</p>
          <form onSubmit={handleSubmit} style={registerPageStyles.form}>
            <div style={registerPageStyles.gridRow}>
              <div>
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div style={registerPageStyles.gridRow}>
              <div>
                <Input
                  label="First Name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  autoComplete="given-name"
                  placeholder="Enter your first name (optional)"
                />
              </div>
              <div>
                <Input
                  label="Last Name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  autoComplete="family-name"
                  placeholder="Enter your last name (optional)"
                />
              </div>
            </div>
            <div style={registerPageStyles.gridRow}>
              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="Enter your password (min 6 characters)"
                />
              </div>
              <div>
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} style={registerPageStyles.submitButton}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <div style={registerPageStyles.footer}>
            <p style={registerPageStyles.footerText}>
              Already have an account?{' '}
              <Link to="/login" style={registerPageStyles.footerLink}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

