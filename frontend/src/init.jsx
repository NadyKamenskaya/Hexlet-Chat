import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider, ErrorBoundary } from '@rollbar/react';

import App from './components/App.jsx';
import resources from './locales/index.js';

const init = async (socket) => {
  const rollbarConfig = {
    accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
    environment: 'production',
  };

  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ru',
      fallbackLng: 'ru',
    });

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <App socket={socket} />
        </I18nextProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default init;
