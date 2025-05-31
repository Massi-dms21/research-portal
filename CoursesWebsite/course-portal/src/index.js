import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // You can add basic global styles here
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Basic MUI theme (can be customized later if needed)
const theme = createTheme({
  palette: {
     mode: 'light', // or 'dark'
    primary: {
      main: '#1976d2', // Default MUI blue
    },
    secondary: {
      main: '#dc004e', // Default MUI pink
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Adds sensible CSS resets and background color */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);