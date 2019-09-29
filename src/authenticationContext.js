import React from 'react';
import {getSessionCookie} from './session';
export const AuthContext = React.createContext(getSessionCookie());