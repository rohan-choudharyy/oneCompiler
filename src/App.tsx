import React, { useEffect, useRef } from 'react'

interface EditorProps {
  code: string; 
  setCode: (newCode: string) => void; 
}

const Editor: React.FC<EditorProps> = ({ code, setCode }) => {
  const editorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const iframe = document.createElement('iframe');
    iframe.src = "https://onecompiler.com/embed?language=nodejs";
    iframe.style.width = "100%";
    iframe.style.height = "500px";
    iframe.style.border = "none";
    iframe.onload = () => {
      const contentWindow = iframe.contentWindow; 
      if (contentWindow) { 
        contentWindow.postMessage({ type: 'SET_CODE', code }, '*');
        contentWindow.addEventListener('message', (event) => {
          if (event.data.type === 'CODE_CHANGE') {
            setCode(event.data.code);
          }
        });
      }
    };

    if (editorRef.current) { 
      editorRef.current.appendChild(iframe);
    }
    return () => {
      if (editorRef.current) { 
        editorRef.current.innerHTML = '';
      }
    };
  }, [code, setCode]);

  return <div ref={editorRef}></div>
}

export default Editor