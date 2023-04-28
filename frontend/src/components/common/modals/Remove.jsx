/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { useApi } from '../../../hooks/index.jsx';

const Remove = ({ props }) => {
  const { t } = useTranslation();
  const notify = () => toast.success(t('notify.removedChannel'));
  const api = useApi();

  const currentChannelId = useSelector((state) => {
    const { currentChannelId } = state.channels;

    return currentChannelId;
  });

  const onClick = (props) => () => {
    const {
      initialState, state, setState,
    } = props;
    const { currentChannel } = state;
    api.removeChannel(currentChannel.id, currentChannelId);
    setState(initialState);
    notify();
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
