/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import {
  Nav, Dropdown, ButtonGroup, Button,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import cn from 'classnames';
import filter from 'leo-profanity';

import { actions as channelsActions } from '../../../slices/channelsSlice.js';
import { actions as modalActions } from '../../../slices/modalSlice.js';

const Channels = ({ channels, currentChannelId }) => {
  filter.getDictionary();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSelect = (id) => () => {
    dispatch(channelsActions.changeChannel(id));
  };

  const handleRename = (id, name) => () => {
    const context = {
      channelId: id,
      channelName: name,
    };

    dispatch(modalActions.open({ type: 'renaming', context }));
  };

  const handleRemove = (id, name) => () => {
    const context = {
      channelId: id,
      channelName: name,
    };

    dispatch(modalActions.open({ type: 'removing', context }));
  };

  const sharedClasses = {
    'w-100': true,
    'rounded-0': true,
    'text-start': true,
  };
  const activeClass = (id) => ({
    'btn-secondary': id === currentChannelId,
  });

  return channels && (
    <Nav
      variant="pills"
      id="channels-box"
      className="flex-column nav-fill px-2 mb-3 overflow-auto h-100 d-block"
    >
      {channels.map((channel) => (
        <Nav.Item
          key={channel.id}
          className="w-100"
        >
          {(!channel.removable)
            ? (
              <Button
                variant="default"
                className={cn(sharedClasses, activeClass(channel.id))}
                onClick={handleSelect(channel.id)}
              >
                <span className="me-1">#</span>
                {filter.clean(channel.name)}
              </Button>
            )
            : (
              <Dropdown
                as={ButtonGroup}
                className="d-flex"
              >
                <Button
                  variant="default"
                  className={cn(sharedClasses, activeClass(channel.id), { 'text-truncate': true })}
                  onClick={handleSelect(channel.id)}
                >
                  <span className="me-1">#</span>
                  {filter.clean(channel.name)}
                </Button>
                <Dropdown.Toggle
                  variant="default"
                  id="react-aria9230295641-1"
                  className={cn(activeClass(channel.id))}
                >
                  <span className="visually-hidden">{t('buttons.channelManagement')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleRemove(channel.id, channel.name)}>{t('buttons.remove')}</Dropdown.Item>
                  <Dropdown.Item onClick={handleRename(channel.id, channel.name)}>{t('buttons.rename')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Channels;
