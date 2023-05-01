/* eslint-disable no-shadow */

import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';

import { customSelectors as channelsSelectors } from '../../../slices/channelsSlice.js';
import { customSelectors as messagesSelectors } from '../../../slices/messagesSlice.js';

const Channel = () => {
  filter.getDictionary();
  const { t } = useTranslation();

  const currentChannel = useSelector(channelsSelectors.currentChannel);
  const messagesAmount = useSelector(messagesSelectors.selectCurrentChannelMessages);

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
