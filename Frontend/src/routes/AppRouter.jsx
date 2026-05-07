import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import HomeContainer from '../containers/HomeContainer';
import AdminContainer from '../containers/AdminContainer';
import FormViewContainer from '../containers/FormViewContainer';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<MainLayout><AdminContainer /></MainLayout>} />
        <Route path="/form/:id" element={<MainLayout><FormViewContainer /></MainLayout>} />
        <Route path="/" element={<MainLayout><HomeContainer /></MainLayout>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
