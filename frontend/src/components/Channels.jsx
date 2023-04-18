import React from 'react';
import {
  Nav, Dropdown, ButtonGroup, Button,
} from 'react-bootstrap';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { selectors, actions } from '../slices/channelsSlice.js';

const Channels = ({ props }) => {
  filter.getDictionary();
  const { state, setState } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const channels = useSelector(selectors.selectAll);
  const currentId = useSelector((stat) => {
    const { currentChannelId } = stat.channels;

    return currentChannelId;
  });

  const handleClick = (value, channel) => () => {
    setState((prevState) => {
      state.modal = !prevState.modal;
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
    'btn-secondary': id === currentId,
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
                  onClick={changeChannel(channel)}
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
                  <Dropdown.Item onClick={handleClick('removing', channel)}>{t('buttons.remove')}</Dropdown.Item>
                  <Dropdown.Item onClick={handleClick('renaming', channel)}>{t('buttons.rename')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Channels;
