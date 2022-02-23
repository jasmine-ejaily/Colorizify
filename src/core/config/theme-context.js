//responsible for keeping a record of current theme throughout the whole app, and providing the function responsible for toggling it
import React from 'react';

export const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => { },
});