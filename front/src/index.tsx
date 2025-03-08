import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import store from "./service/store";
import ProtectedRoute from "./components/Layouts/ProtectedRoute";
import AuthLayout from './components/Layouts/AuthLayout';
import YourPaintings from './pages/YourPaintings';
import YourOffers from './pages/YourOffers';
import GlobalShop from './pages/Shop';
import CreatePainting from './pages/CreatePainting';
import NotFound from './pages/NotFound';
import reportWebVitals from './reportWebVitals';
import SigninForm from './components/SigninForm';
import LoginForm from './components/LoginForm';
import './index.css';
import Home from './pages/Home';
import GlobalUserLayout from './components/Layouts/GlobalUserLayout';
import HowDoesItWork from './pages/HowDoesItWork';
import AboutUs from './pages/AboutUs';
import Vault from './pages/Vault';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<GlobalUserLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/how-does-it-work" element={<HowDoesItWork />} />

            <Route path="/auth" element={<AuthLayout />} >
              <Route path="/auth/login" element={<LoginForm />} />
              <Route path="/auth/register" element={<SigninForm />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/your-paintings" element={<YourPaintings />} />
              <Route path="/shop" element={<GlobalShop />} />
              <Route path="/your-offers" element={<YourOffers />} />
              <Route path="/create-painting" element={<CreatePainting />} />
              <Route path="/your-collecty-vault" element={<Vault />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
