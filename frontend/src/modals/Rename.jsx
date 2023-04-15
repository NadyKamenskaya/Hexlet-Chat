import React, { useEffect, useRef } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../slices/channelsSlice.js';
import { selectors } from '../slices/channelsSlice.js';

const Rename = ({ props }) => {
  const { state } = props;
  const { currentChannel } = state;
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const channels = useSelector(selectors.selectAll).reduce((acc, channel) => [...acc, channel.name], []);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required('Обязательное поле')
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .notOneOf(channels, 'Должно быть уникальным')
  });

  useEffect(() => {
    inputRef.current.select();
  }, [dispatch])

  const onHide = (props) => () => {
    const { setState } = props;
    setState((state) => {
      state.modal = false;
      state.value = null;
    });
  };

  return (
    <>
      <div className="fade modal-backdrop show"></div>
      <div
        className="fade modal show"
        role="dialog"
        arai-modal="true"
        style={{ display: "block" }}
        tabIndex="-1"
      >
        <Modal.Dialog className="modal-dialog-centered">
          <Modal.Header>
            <Modal.Title>Переименовать канал</Modal.Title>
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
          <Formik
              validationSchema={schema}
              onSubmit={(values, { setSubmitting }) => {
                const { initialState, setState, socket } = props;

                try {
                  const { name } = values;
                  socket.emit('renameChannel', { id: currentChannel.id, name });
                  socket.on('renameChannel', (payload) => {
                    dispatch(actions.renameChannel(payload));
                  });
                  setState(initialState);
                } catch (err) {
                  setSubmitting(false);

                  if (err.isAxiosError && err.response.status === 401) {
                    inputRef.current.select();

                    return;
                  }
                  throw err;
                }
              }}
              initialValues={{
                name: currentChannel.name,
              }}
            >
              {({
                handleSubmit,
                handleChange,
                values,
                touched,
                errors,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <div>
                    <Form.Group>
                      <Form.Control
                        className="mb-2" 
                        ref={inputRef}
                        onChange={handleChange}
                        required
                        id="name"
                        name="name"
                        value={values.name}
                        isInvalid={!!errors.name}
                        isValid={touched.name && !errors.name}
                      />
                      <Form.Label
                        className="visually-hidden"
                        htmlFor="name"
                      >
                        Имя канала
                      </Form.Label>
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                      <Button
                        className="me-2"
                        variant="secondary"
                        type="button"
                        onClick={onHide(props)}
                      >
                        Отменить
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                      >
                        Отправить
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal.Dialog>
      </div>
    </>
  );
};

export default Rename;