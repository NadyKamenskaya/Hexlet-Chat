import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import fetchData from './fetchData.js';

import { actions as channelsActions } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.removeChannel, (state, action) => {
        const channel = action.payload;
        const restEntities = Object
          .values(state.entities)
          .filter((e) => channel.id !== e.channelId);
        messagesAdapter.setAll(state, restEntities);
      })
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        messagesAdapter.setAll(state, payload.messages);
      });
  },
});

export const { actions } = messagesSlice;
const selectors = messagesAdapter.getSelectors((state) => state.messages);
export const customSelectors = {
  selectAllMesagges: selectors.selectAll,
  selectCurrentChannelMessages: (state) => {
    const { currentChannelId } = state.channels;

    return selectors.selectAll(state)
      .filter(({ channelId }) => channelId === currentChannelId);
  },
};
export default messagesSlice.reducer;
