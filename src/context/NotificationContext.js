// src/context/NotificationContext.js
import { createContext, useContext } from 'react';

export const NotificationContext = createContext({
  showNotification: () => {}, // valor por defecto como función dentro de un objeto
});

export const useNotification = () => {
  return useContext(NotificationContext);
};
