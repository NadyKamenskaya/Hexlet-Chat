import { Provider } from 'react-redux';
import store from '../slices/index.js';

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
import LoginPage from './LoginPage.jsx';
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
  const auth = useAuth();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} variant="primary">Выйти</Button>
      : null
  );
};

const App = () => (
  <>
    <div className="d-flex flex-column h-100">
      <AuthProvider>
        <Router>
          <Navbar className="shadow-sm" bg="white" expand="lg">
            <div className="container">
              <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
              <AuthButton />
            </div>
          </Navbar>
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={(
                <ChatRoute>
                  <Provider store={store}>
                    <ChatPage />
                  </Provider>
                </ChatRoute>
              )}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
    <div className="Toastify"></div>
  </>
);

export default App;
