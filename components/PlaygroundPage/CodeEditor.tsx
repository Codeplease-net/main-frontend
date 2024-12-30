import React, { useEffect } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Editor from '@monaco-editor/react';
import { Fullscreen, Upload } from 'lucide-react';

const comment = {
  python: "#Have fun coding",
  cpp: "//Have fun coding"
}

export default function CodeEditor({ onclickFullscreen, submitCode }: {onclickFullscreen: (e: number) => void, submitCode: (code: string) => void}) {
  const [theme, setTheme] = React.useState('vs-dark');
  const [language, setLanguage] = React.useState<'python' | 'cpp'>('python');
  const editorRef = React.useRef<any>(null);

  const handleSubmit = () => {
    if (editorRef.current) {
      // Get the value from Monaco Editor
      const code = (editorRef.current as any).getValue();
      submitCode(code);
    }}

  useEffect(() => {
    // Function to update the theme based on classList change
    const updateTheme = () => {
      if (document.documentElement.classList.contains('light')) {
        setTheme('light');
      } else {
        setTheme('vs-dark');
      }
    };

    // Initial check for the theme when the component mounts
    updateTheme();

    // Create a MutationObserver to observe changes in the class attribute
    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Language selector */}
      <div className='flex w-full p-2 justify-between' translate="no">
        <div className='w-1/6'>
          <Select onValueChange={(value: 'python' | 'cpp') => setLanguage(value)}>
            <SelectTrigger>
              <SelectValue placeholder = "Python"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex mr-2'>
          <div className='flex mr-0.5 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer rounded-l py-2 px-3' onClick={handleSubmit}>
            <Upload className='mr-3'/>
            <div>Submit</div>
          </div>
          <div className='flex border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer rounded-r p-2' onClick={() => onclickFullscreen(2)}>
            <Fullscreen />
          </div>
        </div>
        {/* Code editor */}
      </div>  
      <div translate="no" className='h-full mt-1 ml-2 mr-4'>
        <Editor
          height="90%"
          theme={theme}
          language={language}
          value={comment[language]}
          options={{
            minimap: {
              enabled: false,
            },
          }}
          onMount={(editor) => (editorRef.current = editor)}
          />
      </div>
    </>
  );
}