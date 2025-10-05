import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import authConfig from './auth_config.json';
import App from './App';
import './index.css';

ReactDOM.render(
  <Auth0Provider
    domain={authConfig.domain}
    clientId={authConfig.clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      scope: 'openid profile email'
    }}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);