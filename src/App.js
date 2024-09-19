import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // 确保你有这个文件
import AppRouter from './router';
// 其他必要的导入...

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