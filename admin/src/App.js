import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider and createTheme
import './App.css';
import HomePage from './Pages/Home/HomePage';
import ErrorPage from './Pages/ErrorPages/ErrorPage';
import { useEffect } from 'react';
import LoginPage from './Pages/Authentication/LoginPage';

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function PrivateRoute({ element }) {
  const token = localStorage.getItem('token');

  if (token) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
}

// Create a theme with compact density
const theme = createTheme({
  components: {
    MuiDataGrid: {
      defaultProps: {
        density: 'compact',
      },
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell': {
            // padding: '4px',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <Router>
      <ScrollToTopOnRouteChange />
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            path="/*"
            element={
              <PrivateRoute
                element={<HomePage />}
              />
            }
          />
          <Route path="error" element={<ErrorPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
