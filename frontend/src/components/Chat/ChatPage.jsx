/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import { useTranslation } from 'react-i18next';

import axios from 'axios';
import { useImmer } from 'use-immer';
import { useFormik } from 'formik';

import { useApi } from '../../hooks/index.jsx';

import { apiRoutes } from '../../routes/routes.js';

import { actions as channelsActions } from '../../slices/channelsSlice.js';
import { actions as messagesActions } from '../../slices/messagesSlice.js';

import getModal from '../common/modals/index.js';
import Channel from './components/Channel.jsx';
import Channels from './components/Channels';
import Messages from './components/Messages.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const api = useApi();

  const inputRef = useRef(null);
  const initialState = { modal: false, value: null, currentChannel: null };
  const [state, setState] = useImmer(initialState);
  const currentChannelId = useSelector((state) => {
    const { currentChannelId } = state.channels;

    return currentChannelId;
  });

  useEffect(() => {
    inputRef.current.focus();

    const fetchData = async () => {
      const res = await axios.get(apiRoutes.dataPath(), { headers: getAuthHeader() });
      const { channels, messages } = res.data;
      dispatch(channelsActions.addChannels(channels));
      dispatch(messagesActions.addMessages(messages));
    };

    fetchData();
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: (values) => {
      const { username } = JSON.parse(localStorage.userId);
      api.addMessage(values.body, currentChannelId, username);
      inputRef.current.value = '';
      values.body = '';
    },
  });

  const handleClick = (value) => () => {
    setState((state) => {
      state.modal = !state.modal;
      state.value = value;
    });
  };

  const renderModal = (props) => {
    if (!state.modal) {
      return null;
    }
    const Component = getModal(state.value);

    return <Component props={props} />;
  };

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 flex-md-row bg-white">
        <div className="col-4 col-md-2 border-end px-0 flex-column h-100 d-flex bg-light">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('ui.channels')}</b>
            <Button
              className="p-0 text-primary"
              variant="group-vertical"
              onClick={handleClick('adding')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="20"
                height="20"
                fill="currentColor"
                style={{ '--darkreader-inline-fill': 'currentColor' }}
                data-darkreader-inline-fill=""
              >
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <span className="visually-hidden">+</span>
            </Button>
          </div>
          <Channels props={setState} />
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <Channel />
            <div
              className="chat-messages overflow-auto px-5"
              id="messages-box"
            >
              <Messages />
            </div>
            <div className="mt-auto px-5 py-3">
              <Form
                noValidate
                onSubmit={formik.handleSubmit}
                className="py-1 border rounded-2"
              >
                <InputGroup
                  hasValidation={formik.values.body.length === 0}
                >
                  <Form.Control
                    ref={inputRef}
                    className="border-0 p-0 ps-2"
                    onChange={formik.handleChange}
                    name="body"
                    aria-label={t('fields.newMessage')}
                    placeholder={t('fields.inputMessage')}
                    value={formik.values.body}
                  />
                  <Button
                    variant="group-vertical"
                    type="submit"
                    className="border-0"
                    disabled={formik.values.body.length === 0}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="20"
                      height="20"
                      fill="currentColor"
                      style={{ '--darkreader-inline-fill': 'currentColor' }}
                      data-darkreader-inline-fill=""
                    >
                      <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                    </svg>
                    <span className="visually-hidden">{t('buttons.submit')}</span>
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>
        </div>
      </div>
      {renderModal({
        initialState, state, setState,
      })}
    </div>
  );
};

export default ChatPage;
