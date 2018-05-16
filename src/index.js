import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './growth.css';
import '../src/areaLineGraph/lineChart.css'
import App from './App';
import Growth from './Growth';
import AreaLine from './areaLineGraph/AreaLine';

/* Un-comment to display AreaChart */
// ReactDOM.render(<App />, document.getElementById('root'));

/* Un-comment to display Growth AreaChart */
// ReactDOM.render(<Growth />, document.getElementById('root'));

/* Un-comment to display Growth AreaChart */
ReactDOM.render(<AreaLine />, document.getElementById('root'));
