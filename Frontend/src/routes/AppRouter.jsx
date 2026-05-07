import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import HomeContainer from '../containers/HomeContainer';
import AdminContainer from '../containers/AdminContainer';
import FormViewContainer from '../containers/FormViewContainer';
import { ROUTES } from '../constants';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.ADMIN} element={<MainLayout><AdminContainer /></MainLayout>} />
        <Route path={ROUTES.FORM} element={<MainLayout><FormViewContainer /></MainLayout>} />
        <Route path={ROUTES.HOME} element={<MainLayout><HomeContainer /></MainLayout>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
