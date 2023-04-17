import { Provider } from 'react-redux';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { ToastContainer } from 'react-toastify';

import store from '../slices/index.js';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import ChatPage from './ChatPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const ChatRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} variant="primary">{t('buttons.logOut')}</Button>
      : null
  );
};

const App = ({ socket }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="d-flex flex-column h-100">
        <AuthProvider>
          <Router>
            <Navbar className="shadow-sm" bg="white" expand="lg">
              <div className="container">
                <Navbar.Brand as={Link} to="/">{t('ui.hexletChat')}</Navbar.Brand>
                <AuthButton />
              </div>
            </Navbar>
            <Routes>
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage socket={socket} />} />
              <Route
                path="/"
                element={(
                  <ChatRoute>
                    <Provider store={store}>
                      <ChatPage socket={socket} />
                    </Provider>
                  </ChatRoute>
                )}
              />
            </Routes>
          </Router>
        </AuthProvider>
      </div>
      <ToastContainer />
    </>
  );
};

export default App;
