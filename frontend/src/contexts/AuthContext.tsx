import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CognitoUser, AuthenticationDetails, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { useNotification } from './NotificationContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'producer' | 'veterinarian' | 'admin';
  farmId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'producer' | 'veterinarian' | 'admin';
  farmId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const userPool = new CognitoUserPool({
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || '',
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || ''
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
          if (err || !session) {
            setUser(null);
            setLoading(false);
            return;
          }
          const payload = session.getIdToken().decodePayload();
          const userData: User = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload['custom:role'],
            farmId: payload['custom:farmId']
          };
          setUser(userData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      });

      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          const payload = session.getIdToken().decodePayload();
          const userData: User = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload['custom:role'],
            farmId: payload['custom:farmId']
          };
          setUser(userData);
          showNotification('success', 'Inicio de sesión exitoso');
          resolve();
        },
        onFailure: (err) => {
          showNotification('error', 'Error en inicio de sesión: ' + err.message);
          reject(err);
        }
      });
    });
  };

  const logout = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    setUser(null);
    showNotification('info', 'Sesión cerrada');
  };

  const register = async (userData: RegisterData): Promise<void> => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        { Name: 'email', Value: userData.email },
        { Name: 'name', Value: userData.name },
        { Name: 'custom:role', Value: userData.role }
      ];

      if (userData.farmId) {
        attributeList.push({ Name: 'custom:farmId', Value: userData.farmId });
      }

      userPool.signUp(userData.email, userData.password, attributeList, [], (err, result) => {
        if (err) {
          showNotification('error', 'Error en registro: ' + err.message);
          reject(err);
          return;
        }
        showNotification('success', 'Usuario registrado exitosamente');
        resolve();
      });
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
