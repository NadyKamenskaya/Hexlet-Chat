import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img
        className="img-fluid h-25"
        alt={t('ui.notFoundPage')}
        src="https://cdn2.hexlet.io/assets/error-pages/404-4b6ef16aba4c494d8101c104236304e640683fa9abdb3dd7a46cab7ad05d46e9.svg"
      />
      <h1 className="h4 text-muted">{t('ui.notFoundPage')}</h1>
      <p className="text-muted">
        {t('ui.goTo')}
        <a href="/">{t('ui.mainPage')}</a>
      </p>
    </div>
  );
};

export default NotFoundPage;
