import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Growth from './Growth';
import AreaLine from './AreaLine';


it('renders without crashing', () => {
  const div = document.createElement('div');
  // ReactDOM.render(<App />, div);
  // ReactDOM.render(<Growth />, div);
  ReactDOM.render(<AreaLine />, div);
  ReactDOM.unmountComponentAtNode(div);
});
