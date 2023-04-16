import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Card, Image, FloatingLabel } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';

import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const LoginPage = () => {
  const inputRef = useRef(null);
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <Image
                  variant="roundedCircle"
                  src="https://raw.githubusercontent.com/hexlet-components/js-react-hexlet-chat/main/frontend/src/assets/avatar.jpg"
                  alt="Войти"
                />
              </div>
              <Formik
                validationSchema={schema}
                onSubmit={async (values, { setSubmitting }) => {
                  setAuthFailed(false);
    
                  try {
                    const res = await axios.post(routes.loginPath(), values);
                    localStorage.setItem('userId', JSON.stringify(res.data));
                    auth.logIn();
                    const { from } = location.state || { from: { pathname: '/' } };
                    navigate(from);
                  } catch (err) {
                    setSubmitting(false);

                    if (err.isAxiosError && err.response.status === 401) {
                      setAuthFailed(true);
                      inputRef.current.select();

                      return;
                    }
                    throw err;
                  }
                }}
                initialValues={{
                  username: '',
                  password: '',
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  touched,
                  errors,
                }) => (
                  <Form
                    noValidate
                    onSubmit={handleSubmit}
                    className="col-12 col-md-6 mt-3 mt-mb-0"
                  >
                    <h1 className="text-center mb-4">Войти</h1>
                    <FloatingLabel
                      className="mb-3"
                      htmlFor="username"
                      label="Ваш ник"
                    >
                      <Form.Control
                        ref={inputRef}
                        placeholder="Ваш ник"
                        name="username"
                        autoComplete="username"
                        required
                        id="username"
                        onChange={handleChange}
                        value={values.username}
                        isInvalid={authFailed}
                        isValid={touched.username && !errors.username}
                      />
                      </FloatingLabel>
                      <FloatingLabel
                        className="mb-4"
                        htmlFor="password"
                        label="Пароль"
                      >
                      <Form.Control
                        placeholder="Пароль"
                        name="password"
                        autoComplete="current-password"
                        required
                        id="password"
                        type="password"
                        onChange={handleChange}
                        value={values.password}
                        isInvalid={authFailed}
                        isValid={touched.password && !errors.password}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        tooltip
                      >
                        Неверные имя пользователя или пароль
                      </Form.Control.Feedback>
                    </FloatingLabel>
                    <Button
                      className="w-100 mb-3"
                      variant="outline-primary"
                      type="submit"
                    >
                      Войти
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>Нет аккаунта? </span>
                <a href="/signup">Регистрация</a>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
