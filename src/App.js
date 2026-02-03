import React from 'react';
import { HashRouter as Router, Routes, Route, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './global/redux/Store';
import Initializer from './layout/Initializer';
import TopNav from './layout/TopNav';
import TopMenu from './layout/TopMenu';
import Landing from './features/landing/Landing';
import AuthPage from './features/auth/AuthPage';
import AuthSwitch from './features/auth/AuthSwitch';
import './App.css';
import Search from './features/search/Search';
import Profile from './features/profile/Profile';
import AutoLogin from './features/auth/AutoLogin';

function App() {
  return (
    <Provider store={store}>
        <HashRouter>
          <div className="App">
            <TopNav />
            <TopMenu />
            <Initializer/>
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                  path="/search"
                  element={
                    <AuthSwitch>
                      <Search />
                    </AuthSwitch>
                  }
                />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auto-login" element={<AutoLogin />} />
                <Route
                  path="/profile"
                  element={
                    <AuthSwitch>
                      <Profile />
                    </AuthSwitch>
                  }
                />
              </Routes>
            </main>
          </div>
        </HashRouter>
    </Provider>
  );
}

export default App;
