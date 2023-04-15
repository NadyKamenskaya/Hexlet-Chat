import React from 'react';
import { useSelector } from 'react-redux';

const Message = ({ message }) => {
  const channelId = useSelector((state) => {
    const { currentChannelId } = state.channels;

    return currentChannelId;
  });
  if (message.channelId !== channelId) {
    return null;
  }
  const { username, body } = message;

  return (
    <div className="text-break mb-2">
      <b>{username}</b>
      :
      {` ${body}`}
    </div>
  );
};

export default Message;
