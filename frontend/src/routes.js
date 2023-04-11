const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  registrPath: () => [apiPath, 'signup'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
};

export default routes;
