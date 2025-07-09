import AppRoutes from './routes/AppRoutes';
import NavBar from './components/NavBar';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#f9fafb', 
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="md">
        <AppRoutes />
      </Container>
    </ThemeProvider>
  );
}

export default App;
