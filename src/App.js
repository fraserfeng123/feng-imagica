import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppRouter from './router';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <AppRouter />
      </div>
    </Provider>
  );
}

export default App;