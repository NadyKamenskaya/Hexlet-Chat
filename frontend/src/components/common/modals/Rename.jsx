/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import React, { useEffect, useRef } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { useApi } from '../../../hooks/index.jsx';

import { selectors } from '../../../slices/channelsSlice';

const schema = (channels) => yup.object().shape({
  name: yup
    .string()
    .required('errors.required')
    .min(3, 'errors.rangeLetter')
    .max(20, 'errors.rangeLetter')
    .notOneOf(channels, 'errors.notOneOf'),
});

const Rename = ({ props }) => {
  const { t } = useTranslation();
  const notify = () => toast.success(t('notify.renamedChannel'));
  const dispatch = useDispatch();
  const api = useApi();

  const inputRef = useRef(null);
  const { state } = props;
  const { currentChannel } = state;

  const channels = useSelector(selectors.selectAll)
    .reduce((acc, channel) => [...acc, channel.name], []);

  useEffect(() => {
    inputRef.current.select();
  }, [dispatch]);

  const onHide = (props) => () => {
    const { setState } = props;
    setState((state) => {
      state.modal = false;
      state.value = null;
    });
  };

  const formik = useFormik({
    initialValues: {
      name: currentChannel.name,
    },
    validationSchema: schema(channels),
    onSubmit: (values) => {
      const { initialState, setState } = props;

      try {
        const { name } = values;
        api.renameChannel(currentChannel.id, name);
        setState(initialState);
        notify();
      } catch (err) {
        formik.setSubmitting(false);

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
      <div className="fade modal-backdrop show" />
      <div
        className="fade modal show"
        role="dialog"
        arai-modal="true"
        style={{ display: 'block' }}
        tabIndex="-1"
      >
        <Modal.Dialog className="modal-dialog-centered">
          <Modal.Header>
            <Modal.Title>{t('ui.renameChannel')}</Modal.Title>
            <Button
              onClick={onHide(props)}
              type="button"
              className="border-0"
              variant="close"
              aria-label="Close"
              data-bs-dismiss="modal"
            />
          </Modal.Header>
          <Modal.Body>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <div>
                <Form.Group>
                  <Form.Control
                    className="mb-2"
                    ref={inputRef}
                    onChange={formik.handleChange}
                    required
                    id="name"
                    name="name"
                    value={formik.values.name}
                    isInvalid={!!formik.errors.name}
                    isValid={formik.touched.name && !formik.errors.name}
                  />
                  <Form.Label
                    className="visually-hidden"
                    htmlFor="name"
                  >
                    {t('ui.nameChannel')}
                  </Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {t(formik.errors.name)}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button
                    className="me-2"
                    variant="secondary"
                    type="button"
                    onClick={onHide(props)}
                  >
                    {t('buttons.cancel')}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                  >
                    {t('buttons.submit')}
                  </Button>
                </div>
              </div>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
      </div>
    </>
  );
};

export default Rename;
