import React, { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import { selectors } from '../slices/channelsSlice.js';
import { actions } from '../slices/channelsSlice.js';

const Channels = () => {
  const channels = useSelector(selectors.selectAll);
  const currentChannelId = useSelector((state) => {
    const { currentChannelId } = state.channels;

    return currentChannelId;
  });
  const [activeId, setActiveId] = useState(currentChannelId);
  const dispatch = useDispatch();
  const sharedClasses = {
    'w-100': true,
    'rounded-0': true,
    'text-start': true,
    btn: true,
  };
  const activeClass = (id) => ({
    'btn-secondary': id === activeId,
  });
  const changeChannel = (id) => () => {
    setActiveId(id);
    dispatch(actions.changeChannel(id));
  };

  return channels && (
    <ListGroup id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {channels.map(({ id, name, removable }) => (
        <li key={id} className="nav-item w-100">
          {(!removable)
            ? (
              <button type="button" className={cn(sharedClasses, activeClass(id))} onClick={changeChannel(id)}>
                <span className="me-1">#</span>
                {name}
              </button>
            )
          : (
              <div className="d-flex dropdown btn-group" role="group">
                <button className="w-100 rounded-0 text-start text-truncate btn btn-secondary" type="button" onClick={changeChannel(id)}>
                  <span className="me-1">#</span>
                  {name}
                </button>
                <button className="flex-grow-0 dropdown-toggle dropdown-toggle-split btn btn-secondary" id="react-aria9230295641-1" type="button" aria-expanded="false">

                </button>
              </div>
            )
          }
        </li>
      ))}
    </ListGroup>
  );
};

export default Channels;
