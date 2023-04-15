import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Card, Image, FloatingLabel } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';

import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
  password: yup
    .string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], 'Пароли должны совпадать')
    .required('Обязательное поле'),
});

const SignUpPage = ({ socket }) => {
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
            <Card.Body
              className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5"
            >
              <div>
                <Image className="rounded-circle" src="https://frontend-chat-ru.hexlet.app/static/media/avatar_1.6084447160acc893a24d.jpg" alt="Регистрация" />
              </div>
              <Formik
                validationSchema={schema}
                onSubmit={async (values, { setSubmitting }) => {
                  setAuthFailed(false);
    
                  try {
                    const res = await axios.post(routes.signupPath(), { username: values.username, password: values.password });
                    localStorage.setItem('userId', JSON.stringify(res.data));
                    auth.logIn();
                    const { from } = location.state || { from: { pathname: '/' } };
                    navigate(from);
                  } catch (err) {
                    setSubmitting(false);

                    if (err.isAxiosError && err.response.status === 409) {
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
                  confirmPassword: '',
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
                    className="w-50"
                  >
                    <h1 className="text-center mb-4">Регистрация</h1>
                    <FloatingLabel
                      className="mb-3"
                      htmlFor="username"
                      label="Имя пользователя"
                    >
                      <Form.Control
                        ref={inputRef}
                        placeholder="От 3 до 20 символов"
                        name="username"
                        autoComplete="username"
                        required
                        id="username"
                        onChange={handleChange}
                        value={values.username}
                        isInvalid={authFailed || !!errors.username}
                        isValid={touched.username && !errors.username}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        tooltip
                        placement="right"
                      >
                        {errors.username}
                      </Form.Control.Feedback>
                      </FloatingLabel>
                      <FloatingLabel
                      className="mb-3"
                      htmlFor="password"
                      label="Пароль"
                      >
                      <Form.Control
                        placeholder="Не менее 6 символов"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        id="password"
                        aria-describedby="passwordHelpBlock"
                        onChange={handleChange}
                        value={values.password}
                        isInvalid={authFailed || !!errors.password}
                        isValid={touched.password && !errors.password}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        tooltip
                      >
                        {errors.password}
                      </Form.Control.Feedback>
                      </FloatingLabel>
                      <FloatingLabel
                        className="mb-4"
                        htmlFor="confirmPassword"
                        label="Подтвердите пароль"
                      >
                      <Form.Control
                        placeholder="Пароли должны совпадать"
                        name="confirmPassword"
                        autoComplete="new-password"
                        required
                        id="confirmPassword"
                        type="password"
                        onChange={handleChange}
                        value={values.confirmPassword}
                        isInvalid={authFailed || !!errors.confirmPassword}
                        isValid={touched.confirmPassword && !errors.confirmPassword}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        tooltip
                      >
                        {errors.confirmPassword || 'Такой пользователь уже существует'}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                    <Button
                      className="w-100"
                      variant="outline-primary"
                      type="submit"
                    >
                      Зарегистрироваться
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
