import App from './components/App.jsx';

const init = (socket) => {
  return (
    <App socket={socket} />
  );
};

export default init;
