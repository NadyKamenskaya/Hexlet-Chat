import React from 'react';
import { useDispatch } from 'react-redux';

import { ApiContext } from '../contexts/index.jsx';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';

const ApiProvider = ({ socket, children }) => {
  const dispatch = useDispatch();

  const addMessage = (body, channelId, username) => {
    socket.emit('newMessage', { body, channelId, username });
    socket.on('newMessage', (payload) => {
      dispatch(messagesActions.addMessage(payload));
    });
  };

  const addChannel = (values) => {
    socket.emit('newChannel', values);
    socket.on('newChannel', (payload) => {
      dispatch(channelsActions.addChannel(payload));
      dispatch(channelsActions.changeChannel(payload.id));
    });
  };

  const renameChannel = (id, name) => {
    socket.emit('renameChannel', { id, name });
    socket.on('renameChannel', (payload) => {
      dispatch(channelsActions.renameChannel(payload));
    });
  };

  const removeChannel = (id, currentId) => {
    socket.emit('removeChannel', { id });
    socket.on('removeChannel', (payload) => {
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
