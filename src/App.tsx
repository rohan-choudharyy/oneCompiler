import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Switch, FormControlLabel, Box, Container, Typography } from '@mui/material';
import Editor from './components/editor';
import localforage from 'localforage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    const loadSavedCode = async () => {
      try {
        const savedCode = await localforage.getItem<string>('savedCode');
        if (savedCode) {
          setCode(savedCode);
        }
      } catch (error) {
        console.error('Error loading saved code:', error);
      }
    };
    loadSavedCode();
  }, []);

  
  useEffect(() => {
    const saveCode = async () => {
      try {
        await localforage.setItem('savedCode', code);
      } catch (error) {
        console.error('Error saving code:', error);
      }
    };
    saveCode();
  }, [code]);

  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">OneCompiler</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                color="primary"
              />
            }
            label="Dark Mode"
          />
        </Box>
        <Editor 
          code={code} 
          setCode={setCode} 
          isDarkMode={isDarkMode} 
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;