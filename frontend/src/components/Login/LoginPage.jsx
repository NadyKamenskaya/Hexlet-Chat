import React, { useEffect, useRef, useState } from 'react';
import {
  Button, Form, Card, Image, FloatingLabel,
} from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useAuth } from '../../hooks/index.jsx';
import { apiRoutes } from '../../routes/routes.js';

import image from '../../assets/avatar.jpg';

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const LoginPage = () => {
  const { t } = useTranslation();
  const notify = () => toast.error(t('notify.error'));
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const [authFailed, setAuthFailed] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(apiRoutes.loginPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from);
      } catch (err) {
        formik.setSubmitting(false);

        if (err.isAxiosError && err.response.status === 401) {
          notify();
          setAuthFailed(true);
          inputRef.current.select();

          return;
        }
        throw err;
      }
    },
  });

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
                  src={image}
                  alt={t('buttons.logIn')}
                />
              </div>
              <Form
                noValidate
                onSubmit={formik.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">{t('buttons.logIn')}</h1>
                <FloatingLabel
                  controlId="username"
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
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    isInvalid={authFailed}
                    isValid={formik.touched.username && !formik.errors.username}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="password"
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
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    isInvalid={authFailed}
                    isValid={formik.touched.password && !formik.errors.password}
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
