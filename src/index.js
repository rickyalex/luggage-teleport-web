import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Routes from './routes';
import reducer from './reducers';
import { loadState, saveState } from './localStorage';
import Amplify from "aws-amplify";
import { IDENTITY_POOL_ID, cognito, s3 } from "./config";

// import registerServiceWorker from './registerServiceWorker';

const persistedState = loadState()
const store = createStore(reducer, persistedState);

store.subscribe(() => {
    saveState(store.getState())
})

Amplify.configure({
  Auth: {
    identityPoolId: IDENTITY_POOL_ID, //REQUIRED - Amazon Cognito Identity Pool ID
    region: cognito.REGION, // REQUIRED - Amazon Cognito Region
    userPoolId: cognito.USER_POOL_ID, //OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: cognito.CLIENT_ID, //OPTIONAL - Amazon Cognito Web Client ID
  },
  Storage: {
    region: s3.REGION,
    bucket: s3.BUCKET,
    identityPoolId: IDENTITY_POOL_ID, //REQUIRED - Amazon Cognito Identity Pool ID
  }
});

ReactDOM.render(
    <Provider store={store}>
        <Routes />
    </Provider>
    , document.getElementById('root'));
// registerServiceWorker();
