import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "./store/authSlice";

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import logoImage from './assets/logo.png';
import AddItem from './components/AddItem';
import Layout from './components/Layout';
import EditItem from './components/EditItem';
import Dashboard from './components/Dashboard';
import ShowAllItems from './components/ShowAllItems';
import ShowSingleItem from './components/ShowSingleItem';

// Define your routes
const router = createBrowserRouter([
  {
    path: '/', // Root path for unauthenticated or general dashboard
    element: <Dashboard />,
  },
  {
    path: '/signin', // Sign-in route
    element: <SignIn logoSrc={logoImage} />,
  },
  {
    path: '/signup', // Sign-up route
    element: <SignUp logoSrc={logoImage} />,
  },
  {
    path: '/', // Layout for authenticated users
    element: <Layout />, // Layout wraps all routes requiring authentication
    children: [
      { path: 'add-item', element: <AddItem /> },
      { path: 'edit-item/:itemId', element: <EditItem /> },
      { path: 'show-all', element: <ShowAllItems /> }, // Route for all items
      { path: 'item/:itemId', element: <ShowSingleItem /> }, // Route for single item
    ],
  },
  
]);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Retrieve token from localStorage on app load
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      dispatch(setToken(storedToken)); // Dispatch action to set the token
    }
  }, [dispatch]);

  return (
    <div>
      {/* Provide the router to the app */}
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
