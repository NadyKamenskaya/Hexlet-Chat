/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import React, { useEffect, useRef } from 'react';
import {
  Button, Modal, Form, ModalFooter,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { useApi } from '../../../hooks/index.jsx';

import { customSelectors } from '../../../slices/channelsSlice';
import { selectors } from '../../../slices/modalSlice';

const schema = (channels) => yup.object().shape({
  name: yup
    .string()
    .required('errors.required')
    .min(3, 'errors.rangeLetter')
    .max(20, 'errors.rangeLetter')
    .notOneOf(channels, 'errors.notOneOf'),
});

const Rename = ({ handleClose }) => {
  const { t } = useTranslation();
  const api = useApi();

  const inputRef = useRef(null);

  const channelsName = useSelector(customSelectors.selectAll)
    .reduce((acc, channel) => [...acc, channel.name], []);
  const { channelId, channelName } = useSelector(selectors.getModalContext);

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: channelName,
    },
    validationSchema: schema(channelsName),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      try {
        const { name } = values;
        api.renameChannel(channelId, name);
        toast.success(t('notify.renamedChannel'));
      } catch (err) {
        formik.setSubmitting(false);
        toast.error(t('notify.error'));

        if (err.isAxiosError && err.response.status === 401) {
          inputRef.current.select();

          return;
        }
        throw err;
      }
    },
  });

  return (
    <>
      {/* <Modal.Dialog className="modal-dialog-centered"> */}
      <Modal.Header closeButton>
        <Modal.Title>{t('ui.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <div>
            <Form.Group controlId="name">
              <Form.Control
                className="mb-2"
                name="name"
                required
                ref={inputRef}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
                isInvalid={formik.errors.name && formik.touched.name}
                isValid={formik.touched.name && !formik.errors.name}
                disabled={formik.isSubmitting}
              />
              <Form.Label
                visuallyHidden
                htmlFor="name"
              >
                {t('ui.nameChannel')}
              </Form.Label>
              <Form.Control.Feedback type="invalid">
                {t(formik.errors.name)}
              </Form.Control.Feedback>
            </Form.Group>
            <ModalFooter
              className="d-flex justify-content-end"
            >
              <Button
                className="me-2"
                variant="secondary"
                type="button"
                onClick={handleClose}
              >
                {t('buttons.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {t('buttons.submit')}
              </Button>
            </ModalFooter>
          </div>
        </Form>
      </Modal.Body>
      {/* </Modal.Dialog> */}
    </>
  );
};

export default Rename;
