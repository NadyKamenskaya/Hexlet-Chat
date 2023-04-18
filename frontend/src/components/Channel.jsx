import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';

import { selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { selectors as messagesSelectors } from '../slices/messagesSlice.js';

const Channel = () => {
  filter.getDictionary();
  const { t } = useTranslation();
  const messages = useSelector(messagesSelectors.selectAll);
  const channels = useSelector(channelsSelectors.selectAll);

  const { currentChannel, messagesAmount } = useSelector((state) => {
    const { currentChannelId } = state.channels;
    const channel = channels.find(({ id }) => id === currentChannelId);
    const amount = messages
      .filter(({ channelId }) => channelId === currentChannelId).length;

    return { channel, amount };
  });

  return currentChannel && (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        <b>{`# ${filter.clean(currentChannel.name)}`}</b>
      </p>
      <span className="text-muted">
        {t('ui.counter.count', { count: messagesAmount })}
      </span>
    </div>
  );
};

export default Channel;
