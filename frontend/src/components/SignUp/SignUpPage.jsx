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

import image from '../../assets/avatar_1.jpg';

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'errors.rangeLetter')
    .max(20, 'errors.rangeLetter')
    .required('errors.required'),
  password: yup
    .string()
    .min(6, 'errors.minLetter')
    .required('errors.required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'errors.checkPassword')
    .required('errors.required'),
});

const SignUpPage = () => {
  const { t } = useTranslation();
  const notify = () => toast.error(t('notify.error'));
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(apiRoutes.signupPath(), {
          username: values.username, password: values.password,
        });
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from);
      } catch (err) {
        formik.setSubmitting(false);

        if (err.isAxiosError && err.response.status === 409) {
          notify();
          setAuthFailed(true);
          inputRef.current.select();

          return;
        }
        throw err;
      }
    },
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
                  src={image}
                  alt={t('ui.registration')}
                />
              </div>
              <Form
                noValidate
                onSubmit={formik.handleSubmit}
                className="w-50"
              >
                <h1 className="text-center mb-4">{t('ui.registration')}</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <FloatingLabel
                    controlId="username"
                    className="mb-3"
                    htmlFor="username"
                    label={t('fields.username')}
                  >
                    <Form.Control
                      ref={inputRef}
                      placeholder={t('fields.username')}
                      name="username"
                      autoComplete="username"
                      required
                      id="username"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      isInvalid={authFailed || !!formik.errors.username}
                      isValid={formik.touched.username && !formik.errors.username}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      tooltip
                      placement="right"
                    >
                      {t(formik.errors.username)}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="password"
                    className="mb-3"
                    htmlFor="password"
                    label={t('fields.password')}
                  >
                    <Form.Control
                      placeholder={t('fields.password')}
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      id="password"
                      aria-describedby="passwordHelpBlock"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      isInvalid={authFailed || !!formik.errors.password}
                      isValid={formik.touched.password && !formik.errors.password}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      tooltip
                    >
                      {t(formik.errors.password)}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="confirmPassword"
                    className="mb-4"
                    htmlFor="confirmPassword"
                    label={t('fields.confirmPassword')}
                  >
                    <Form.Control
                      placeholder={t('fields.confirmPassword')}
                      name="confirmPassword"
                      autoComplete="new-password"
                      required
                      id="confirmPassword"
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                      isInvalid={authFailed || !!formik.errors.confirmPassword}
                      isValid={formik.touched.confirmPassword && !formik.errors.confirmPassword}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      tooltip
                    >
                      {t(formik.errors.confirmPassword) || t('errors.alreadyExists')}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <Button
                    className="w-100"
                    variant="outline-primary"
                    type="submit"
                  >
                    {t('buttons.register')}
                  </Button>
                </fieldset>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
