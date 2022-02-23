import React, { memo } from 'react';
import App from "./src/index.js";

//responsible for rendering the app returned from the navigator
const Main = () => {
  return (
    <App />
  );
};

export default memo(Main);





