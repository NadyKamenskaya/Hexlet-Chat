import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';

import init from './init.jsx';

const app = () => {
  const socket = io();
  const root = createRoot(document.getElementById('chat'));
  root.render(init(socket));
};

app();
