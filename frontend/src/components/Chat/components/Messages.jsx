import React from 'react';
import { useSelector } from 'react-redux';

import { selectors } from '../../../slices/messagesSlice.js';

import Message from './Message.jsx';

const Messages = () => {
  const messages = useSelector(selectors.selectAll);

  return messages && (
    <>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </>
  );
};

export default Messages;
