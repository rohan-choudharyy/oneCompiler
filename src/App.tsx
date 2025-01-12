import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  Button, 
  Box, 
  Container, 
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import Confetti from 'react-confetti';
import Editor from './components/editor';
import localforage from 'localforage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });
  
  const [code, setCode] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const loadSavedCode = async () => {
      try {
        const savedCode = await localforage.getItem<string>('savedNodeCode');
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
        await localforage.setItem('savedNodeCode', code);
      } catch (error) {
        console.error('Error saving code:', error);
      }
    };
    saveCode();
  }, [code]);

  
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleRunCode = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ 
          code, 
          action: 'run',
          language: 'nodejs' 
        }), 
        'https://onecompiler.com'
      );
      
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleFormatCode = async () => {
    setIsFormatting(true);
    try {
      const prettier = await import('prettier');
      const babelParser = await import('prettier/parser-babel');
      
      const formattedCode = await prettier.format(code, {
        parser: 'babel',
        plugins: [babelParser],
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 80,
        tabWidth: 2,
      });
      
      setCode(formattedCode);
    } catch (err) {
      console.error('Formatting error:', err);
      alert('Failed to format code. Please check if the code syntax is valid.');
    } finally {
      setIsFormatting(false);
    }
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: isDarkMode ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: isDarkMode ? '#121212' : '#f5f5f5',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showConfetti && <Confetti />}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          gap: 2
        }}>
          <Typography variant="h4">Node.js Compiler</Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2
          }}>
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
            >
              Run Code
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleFormatCode} 
              startIcon={<FormatAlignLeftIcon />}
              disabled={isFormatting}
            >
              {isFormatting ? 'Formatting...' : 'Format Code'}
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
          frameBorder="0"
          height="450px"
          src="https://onecompiler.com/embed/nodejs"
          width="100%"
        ></iframe>
      </Container>
    </ThemeProvider>
  );
}

export default App;
