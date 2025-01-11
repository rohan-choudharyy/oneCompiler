import React, { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';

interface EditorProps {
  code: string;
  setCode: (newCode: string) => void;
  isDarkMode: boolean;
}

const Editor: React.FC<EditorProps> = ({ 
  code, 
  setCode, 
  isDarkMode 
}) => {
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        '& textarea': {
          width: '100%',
          minHeight: '500px',
          backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
          color: isDarkMode ? 'white' : 'black',
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '14px',
          resize: 'vertical',
          outline: 'none',
          transition: 'all 0.3s ease'
        }
      }}
    >
      <textarea 
        value={code} 
        onChange={handleCodeChange} 
        placeholder="Enter your code here..."
      />
    </Box>
  );
};

export default Editor;