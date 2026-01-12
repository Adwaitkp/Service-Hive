import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import { checkAuth } from './store/slices/authSlice';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import SocketManager from './components/SocketManager';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';
import MyGigs from './pages/MyGigs';
import GigBids from './pages/GigBids';
import MyBids from './pages/MyBids';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <SocketManager />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gigs/:id" element={<GigDetails />} />
          <Route
            path="/create-gig"
            element={
              <PrivateRoute>
                <CreateGig />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-gigs"
            element={
              <PrivateRoute>
                <MyGigs />
              </PrivateRoute>
            }
          />
          <Route
            path="/gigs/:id/bids"
            element={
              <PrivateRoute>
                <GigBids />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bids"
            element={
              <PrivateRoute>
                <MyBids />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
