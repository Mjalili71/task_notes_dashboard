import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';

interface AuthWrapperProps {
  currentPage: 'login' | 'register' | 'dashboard';
  onPageChange: (page: 'login' | 'register' | 'dashboard') => void;
  children?: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  currentPage, 
  onPageChange, 
  children 
}) => {
  const { isAuthenticated, logout } = useAuth();

  // اگر کاربر لاگین کرده و در صفحه لاگین/ثبت‌نام است، به داشبورد برو
  if (isAuthenticated && (currentPage === 'login' || currentPage === 'register')) {
    onPageChange('dashboard');
    return null;
  }

  // اگر کاربر لاگین نکرده و در داشبورد است، به لاگین برو
  if (!isAuthenticated && currentPage === 'dashboard') {
    onPageChange('login');
    return null;
  }

  // نمایش صفحات بر اساس currentPage
  switch (currentPage) {
    case 'login':
      return <Login onNavigateToRegister={() => onPageChange('register')} />;
    case 'register':
      return <Register onNavigateToLogin={() => onPageChange('login')} />;
    case 'dashboard':
      return (
        <div>
          {/* دکمه خروج */}
          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              خروج
            </button>
          </div>
          {children}
        </div>
      );
    default:
      return <Login onNavigateToRegister={() => onPageChange('register')} />;
  }
};

export default AuthWrapper;
