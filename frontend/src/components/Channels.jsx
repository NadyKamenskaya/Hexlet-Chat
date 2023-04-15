import React from 'react';
import { Nav, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import { selectors } from '../slices/channelsSlice.js';
import { actions } from '../slices/channelsSlice.js';

const Channels = ({ props }) => {
  const dispatch = useDispatch();

  const channels = useSelector(selectors.selectAll);
  const currentChannelId = useSelector((state) => {
    const { currentChannelId } = state.channels;

    return currentChannelId;
  });

  const handleClick = (value, channel) => () => {
    props((state) => {
      state.modal = !state.modal;
      state.value = value;
      state.currentChannel = channel;
    });
  };

  const changeChannel = (channel) => () => {
    dispatch(actions.changeChannel(channel.id));
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
                onClick={changeChannel(channel)}
              >
                <span className="me-1">#</span>
                {channel.name}
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
              onClick={changeChannel(channel)}
            >
              <span className="me-1">#</span>
              {channel.name}
            </Button>
            <Dropdown.Toggle
              variant="default"
              id="react-aria9230295641-1"
              className={cn(activeClass(channel.id))}
            >
              <span className="visually-hidden">Управление каналом</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleClick('removing', channel)}>Удалить</Dropdown.Item>
              <Dropdown.Item onClick={handleClick('renaming', channel)}>Переименовать</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
            )
          }
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Channels;
