import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { cognito } from './config';

import AWS from 'aws-sdk'


export function getUserToken(currentUser) {
    return new Promise((resolve, reject) => {
      if (currentUser === null) {
        return false;
      }
      currentUser.getSession(function(err, session) {
        if (err) {
          reject(err);
          return;
        }
        resolve(session.getIdToken().getJwtToken());
      });
    });
  }
  
 export function getCurrentUser() {
    const userPool = new CognitoUserPool({
      UserPoolId: cognito.USER_POOL_ID,
      ClientId: cognito.CLIENT_ID
    });
    return userPool.getCurrentUser();
  }