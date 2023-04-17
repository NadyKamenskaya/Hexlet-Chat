import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Card, Image, FloatingLabel } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const LoginPage = () => {
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
                  alt={t('buttons.logIn')}
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
                    <h1 className="text-center mb-4">{t('buttons.logIn')}</h1>
                    <FloatingLabel
                      className="mb-3"
                      htmlFor="username"
                      label={t('fields.nickname')}
                    >
                      <Form.Control
                        ref={inputRef}
                        placeholder={t('fields.nickname')}
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
                        label={t('fields.password')}
                      >
                      <Form.Control
                        placeholder={t('fields.password')}
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
                        {t('errors.incorrect')}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                    <Button
                      className="w-100 mb-3"
                      variant="outline-primary"
                      type="submit"
                    >
                      {t('buttons.logIn')}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('ui.noAccount')}</span>
                <a href="/signup">{t('ui.registration')}</a>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
