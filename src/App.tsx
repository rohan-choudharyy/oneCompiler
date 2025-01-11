import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Switch, FormControlLabel, Button, Box, Container, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Confetti from 'react-confetti';
import Editor from './components/editor';
import localforage from 'localforage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [code, setCode] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const handleRunCode = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ 
          code, 
          action: 'run',
          language: 'python'
        }), 
        'https://onecompiler.com'
      );
      
      // Trigger confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showConfetti && <Confetti />}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">OneCompiler</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleRunCode} 
              startIcon={<PlayArrowIcon />}
              sx={{ ml: 2 }}
            >
              Run Code
            </Button>
          </Box>
        </Box>
        <Editor 
          code={code} 
          setCode={setCode} 
          isDarkMode={isDarkMode} 
        />
        <iframe
          ref={iframeRef}
          src="https://onecompiler.com/embed/python"
          style={{ display: 'none' }}
        ></iframe>
      </Container>
    </ThemeProvider>
  );
}

export default App;