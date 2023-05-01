import React from 'react';
import { useDispatch } from 'react-redux';

import { ApiContext } from '../contexts/index.jsx';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';

const ApiProvider = ({ socket, children }) => {
  const dispatch = useDispatch();

  const addMessage = async (body, channelId, username) => {
    await socket.emit('newMessage', { body, channelId, username });
    await socket.on('newMessage', (payload) => {
      dispatch(messagesActions.addMessage(payload));
    });
  };

  const addChannel = async (values) => {
    await socket.emit('newChannel', values);
    await socket.on('newChannel', (payload) => {
      dispatch(channelsActions.addChannel(payload));
      dispatch(channelsActions.changeChannel(payload.id));
    });
  };

  const renameChannel = async (id, name) => {
    await socket.emit('renameChannel', { id, name });
    await socket.on('renameChannel', (payload) => {
      dispatch(channelsActions.renameChannel(payload));
    });
  };

  const removeChannel = async (id, currentId) => {
    await socket.emit('removeChannel', { id });
    await socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.removeChannel(payload));
      if (payload.id === currentId) {
        dispatch(channelsActions.changeChannel(1));
      }
    });
  };

  return (
    <ApiContext.Provider value={{
      addChannel, addMessage, renameChannel, removeChannel,
    }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
