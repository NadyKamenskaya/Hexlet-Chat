import { createRoot } from 'react-dom/client';

import init from './init.jsx';

const app = async () => {
  const root = createRoot(document.getElementById('chat'));
  root.render(await init());
};

app();
