import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="text-center">
      <img className="img-fluid h-25" alt="Страница не найдена" src="https://cdn2.hexlet.io/assets/error-pages/404-4b6ef16aba4c494d8101c104236304e640683fa9abdb3dd7a46cab7ad05d46e9.svg" />
      <h1 className="h4 text-muted">Страница не найдена</h1>
      <p className="text-muted">
        Но вы можете перейти <a href="/">на главную страницу</a>
      </p>
    </div>
  );
};

export default NotFoundPage;