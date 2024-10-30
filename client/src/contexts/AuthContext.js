// // client/src/contexts/AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from '../utils/axios';
// import LoadingScreen from '../components/LoadingScreen';

// const AuthContext = createContext(null);

// // Initial state
// const initialState = {
//   user: null,
//   loading: true,
//   error: null,
//   isAuthenticated: false,
// };

// export const AuthProvider = ({ children }) => {
//   const [state, setState] = useState(initialState);

//   // Initialize auth state
//   useEffect(() => {
//     const initializeAuth = async () => {
//       const token = localStorage.getItem('token');
//       const savedUser = JSON.parse(localStorage.getItem('user'));

//       if (token && savedUser) {
//         try {
//           // Set default axios header
//           axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
//           // Verify token with backend
//           const response = await axios.get('/auth/verify');
          
//           setState({
//             user: response.data,
//             loading: false,
//             error: null,
//             isAuthenticated: true,
//           });
//         } catch (error) {
//           console.error('Auth initialization error:', error);
//           // Clear invalid auth data
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           delete axios.defaults.headers.common['Authorization'];
          
//           setState({
//             user: null,
//             loading: false,
//             error: 'Session expired. Please login again.',
//             isAuthenticated: false,
//           });
//         }
//       } else {
//         setState({
//           user: null,
//           loading: false,
//           error: null,
//           isAuthenticated: false,
//         });
//       }
//     };

//     initializeAuth();
//   }, []);

//   // Login function
//   const login = async (credentials) => {
//     try {
//       setState(prev => ({ ...prev, loading: true, error: null }));
      
//       const response = await axios.post('/auth/login', credentials);
//       const { token, user } = response.data;

//       // Set auth token in axios defaults
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//       // Store auth data
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));

//       setState({
//         user,
//         loading: false,
//         error: null,
//         isAuthenticated: true,
//       });

//       return response.data;
//     } catch (error) {
//       setState(prev => ({
//         ...prev,
//         loading: false,
//         error: error.response?.data?.message || 'Login failed',
//         isAuthenticated: false,
//       }));
//       throw error;
//     }
//   };

//   // Register function
//   const register = async (userData) => {
//     try {
//       setState(prev => ({ ...prev, loading: true, error: null }));
      
//       const response = await axios.post('/auth/register', userData);
//       const { token, user } = response.data;

//       // Set auth token in axios defaults
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//       // Store auth data
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));

//       setState({
//         user,
//         loading: false,
//         error: null,
//         isAuthenticated: true,
//       });

//       return response.data;
//     } catch (error) {
//       setState(prev => ({
//         ...prev,
//         loading: false,
//         error: error.response?.data?.message || 'Registration failed',
//         isAuthenticated: false,
//       }));
//       throw error;
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       // Optional: Call backend logout endpoint
//       await axios.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       // Clear auth data regardless of backend response
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       delete axios.defaults.headers.common['Authorization'];
      
//       setState({
//         user: null,
//         loading: false,
//         error: null,
//         isAuthenticated: false,
//       });
//     }
//   };

//   // Update user profile
//   const updateProfile = async (userData) => {
//     try {
//       setState(prev => ({ ...prev, loading: true, error: null }));
      
//       const response = await axios.put('/auth/profile', userData);
//       const updatedUser = response.data;

//       // Update stored user data
//       localStorage.setItem('user', JSON.stringify(updatedUser));

//       setState(prev => ({
//         ...prev,
//         user: updatedUser,
//         loading: false,
//         error: null,
//       }));

//       return updatedUser;
//     } catch (error) {
//       setState(prev => ({
//         ...prev,
//         loading: false,
//         error: error.response?.data?.message || 'Profile update failed',
//       }));
//       throw error;
//     }
//   };

//   // Change password
//   const changePassword = async (passwordData) => {
//     try {
//       setState(prev => ({ ...prev, loading: true, error: null }));
      
//       await axios.put('/auth/password', passwordData);

//       setState(prev => ({
//         ...prev,
//         loading: false,
//         error: null,
//       }));
//     } catch (error) {
//       setState(prev => ({
//         ...prev,
//         loading: false,
//         error: error.response?.data?.message || 'Password change failed',
//       }));
//       throw error;
//     }
//   };

//   // Reset password request
//   const requestPasswordReset = async (email) => {
//     try {
//       setState(prev => ({ ...prev, loading: true, error: null }));
      
//       await axios.post('/auth/reset-password-request', { email });

//       setState(prev => ({
//         ...prev,
//         loading: false,
//         error: null,
//       }));
//     } catch (error) {
//       setState(prev => ({
//         ...prev,
//         loading: false,
//         error: error.response?.data?.message || 'Password reset request failed',
//       }));
//       throw error;
//     }
//   };

//   // Reset password with token
//   const resetPassword = async (token, newPassword) => {
//     try {
//       setState(prev => ({ ...prev, loading: true, error: null }));
      
//       await axios.post('/auth/reset-password', { token, newPassword });

//       setState(prev => ({
//         ...prev,
//         loading: false,
//         error: null,
//       }));
//     } catch (error) {
//       setState(prev => ({
//         ...prev,
//         loading: false,
//         error: error.response?.data?.message || 'Password reset failed',
//       }));
//       throw error;
//     }
//   };

//   // Clear error
//   const clearError = () => {
//     setState(prev => ({ ...prev, error: null }));
//   };

//   // Context value
//   const value = {
//     user: state.user,
//     loading: state.loading,
//     error: state.error,
//     isAuthenticated: state.isAuthenticated,
//     login,
//     register,
//     logout,
//     updateProfile,
//     changePassword,
//     requestPasswordReset,
//     resetPassword,
//     clearError,
//   };

//   if (state.loading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Export the context for rare cases when you need to use the context directly
// export default AuthContext;


import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';
import LoadingScreen from '../components/LoadingScreen';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        loading: true,
        error: null,
        isAuthenticated: false
    });

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            
            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    console.log('Verifying token...');
                    const response = await axios.get('/auth/verify');
                    console.log('Verification response:', response.data);
                    setState({
                        user: response.data,
                        loading: false,
                        error: null,
                        isAuthenticated: true
                    });
                } catch (error) {
                    console.error('Auth error:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    delete axios.defaults.headers.common['Authorization'];
                    setState({
                        user: null,
                        loading: false,
                        error: 'Session expired',
                        isAuthenticated: false
                    });
                }
            } else {
                setState({
                    user: null,
                    loading: false,
                    error: null,
                    isAuthenticated: false
                });
            }
        };

        initializeAuth();
    }, []);
  // Register function
  const register = async (userData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await axios.post('/auth/register', userData);
      const { token, user } = response.data;

      // Set auth token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Registration failed',
        isAuthenticated: false,
      }));
      throw error;
    }
  };
    const login = async (credentials) => {
        try {
            const response = await axios.post('/auth/login', credentials);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setState({
                user,
                loading: false,
                error: null,
                isAuthenticated: true
            });
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false
        });
    };

    if (state.loading) {
        return <LoadingScreen />;
    }

    return (
        <AuthContext.Provider value={{
            user: state.user,
            loading: state.loading,
            error: state.error,
            isAuthenticated: state.isAuthenticated,
            login,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};