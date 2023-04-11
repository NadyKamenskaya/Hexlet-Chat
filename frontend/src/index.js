import { createRoot } from 'react-dom/client';
import init from './init.jsx';

const app = () => {
  const root = createRoot(document.getElementById('chat'));
  root.render(init());
};

app();
