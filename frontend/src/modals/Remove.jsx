import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { actions } from '../slices/channelsSlice.js';

const Remove = ({ props }) => {
  const { t } = useTranslation();
  const notify = () => toast.success(t('notify.removedChannel'));
  const dispatch = useDispatch();

  const currentId = useSelector((state) => {
    const { currentChannelId } = state.channels;

    return currentChannelId;
  });

  const onClick = () => () => {
    const {
      initialState, state, setState, socket,
    } = props;
    const { currentChannel } = state;
    socket.emit('removeChannel', { id: currentChannel.id });
    socket.on('removeChannel', (payload) => {
      dispatch(actions.removeChannel(payload));
      if (payload.id === currentId) {
        dispatch(actions.changeChannel(1));
      }
    });
    setState(initialState);
    notify();
  };

  const onHide = () => () => {
    const { state, setState } = props;
    setState((prevState) => {
      state.modal = !prevState;
      state.value = null;
    });
  };

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
            <Modal.Title>{t('ui.removeChannel')}</Modal.Title>
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
            <p className="lead">Уверены?</p>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={onHide(props)}
              >
                {t('buttons.cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={onClick(props)}
              >
                {t('buttons.remove')}
              </Button>
            </div>
          </Modal.Body>
        </Modal.Dialog>
      </div>
    </>
  );
};

export default Remove;
