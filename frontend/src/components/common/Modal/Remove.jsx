/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { useApi } from '../../../hooks/index.jsx';

import { customSelectors } from '../../../slices/channelsSlice';

const Remove = ({ handleClose }) => {
  const { t } = useTranslation();
  const api = useApi();

  const currentChannel = useSelector(customSelectors.selectCurrentChannel);

  const onClick = () => {
    api.removeChannel(currentChannel);
    toast.success(t('notify.removedChannel'));
  };

  return (
    <>
      {/* <Modal.Dialog className="modal-dialog-centered"> */}
      <Modal.Header closeButton>
        <Modal.Title>{t('ui.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Уверены?</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            className="me-2"
            onClick={handleClose}
          >
            {t('buttons.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={onClick}
          >
            {t('buttons.remove')}
          </Button>
        </div>
      </Modal.Body>
      {/* </Modal.Dialog> */}
    </>
  );
};

export default Remove;
