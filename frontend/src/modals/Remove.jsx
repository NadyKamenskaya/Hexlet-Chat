import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import { actions } from '../slices/channelsSlice.js';

const Remove = ({ props }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentChannelId = useSelector((state) => {
    const { currentChannelId } = state.channels;

    return currentChannelId;
  });

  const onClick = (props) => () => {
    const { initialState, state, setState, socket } = props;
    const { currentChannel } = state;
    socket.emit('removeChannel', { id: currentChannel.id });
    socket.on('removeChannel', (payload) => {
      dispatch(actions.removeChannel(payload));
      if (payload.id === currentChannelId) {
        dispatch(actions.changeChannel(1));
      }
    });
    setState(initialState);
  };

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
