import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.scss';

const store = configureStore();

 const jsx = (
     <Provider store={store}>
         <AppRouter />
     </Provider>
 );

ReactDOM.render(jsx, document.getElementById('app'))
