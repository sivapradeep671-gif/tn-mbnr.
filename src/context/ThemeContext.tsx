import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

/**
 * TN-MBNR Dual Theme System
 * 
 * Customer Theme ("Aspiration"): For business owners & citizens
 *   - Indigo/Cyan palette, rounded UI, mobile-first wizard flows
 *   - Focus: Speed, clarity, step-by-step guidance
 * 
 * Government Theme ("Decision"): For inspectors, admins, executives
 *   - Navy/Gold palette, dense data tables, desktop-first dashboards
 *   - Focus: Efficiency, oversight, exception-based workflows
 */

type ThemeMode = 'customer' | 'government';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isCustomer: boolean;
  isGovernment: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'government',
  setTheme: () => {},
  isCustomer: false,
  isGovernment: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (user) {
      const customerRoles = ['business', 'citizen'];
      if (customerRoles.includes(user.role)) {
        return 'customer';
      }
    }
    return 'government';
  });

  const [prevUser, setPrevUser] = useState(user);

  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      const customerRoles = ['business', 'citizen'];
      const targetTheme = customerRoles.includes(user.role) ? 'customer' : 'government';
      if (theme !== targetTheme) {
        setTheme(targetTheme);
      }
    } else if (theme !== 'government') {
      setTheme('government');
    }
  }

  // Apply data-theme attribute to document for CSS theming
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      isCustomer: theme === 'customer',
      isGovernment: theme === 'government',
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
