import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button, Form, Card, Image, FloatingLabel,
} from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const SignUpPage = () => {
  const { t } = useTranslation();
  const notify = () => toast.error(t('notify.error'));
  const inputRef = useRef(null);
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(3, t('errors.rangeLetter'))
      .max(20, t('errors.rangeLetter'))
      .required(t('errors.required')),
    password: yup
      .string()
      .min(6, t('errors.minLetter'))
      .required(t('errors.required')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], t('errors.checkPassword'))
      .required(t('errors.required')),
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body
              className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5"
            >
              <div>
                <Image
                  className="rounded-circle"
                  src="https://frontend-chat-ru.hexlet.app/static/media/avatar_1.6084447160acc893a24d.jpg"
                  alt={t('ui.registration')}
                />
              </div>
              <Formik
                validationSchema={schema}
                onSubmit={async (values, { setSubmitting }) => {
                  setAuthFailed(false);

                  try {
                    const res = await axios.post(routes.signupPath(), {
                      username: values.username, password: values.password,
                    });
                    localStorage.setItem('userId', JSON.stringify(res.data));
                    auth.logIn();
                    const { from } = location.state || { from: { pathname: '/' } };
                    navigate(from);
                  } catch (err) {
                    setSubmitting(false);

                    if (err.isAxiosError && err.response.status === 409) {
                      notify();
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
                    <h1 className="text-center mb-4">{t('ui.registration')}</h1>
                    <FloatingLabel
                      className="mb-3"
                      htmlFor="username"
                      label={t('fields.username')}
                    >
                      <Form.Control
                        ref={inputRef}
                        placeholder={t('errors.rangeLetter')}
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
                      label={t('fields.password')}
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
                      label={t('errors.confirmPassword')}
                    >
                      <Form.Control
                        placeholder={t('errors.checkPassword')}
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
                        {errors.confirmPassword || t('errors.alreadyExists')}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                    <Button
                      className="w-100"
                      variant="outline-primary"
                      type="submit"
                    >
                      {t('buttons.register')}
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
