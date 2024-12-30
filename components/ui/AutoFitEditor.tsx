import * as React from "react";
import Editor, {loader} from "@monaco-editor/react";
import { editor } from "monaco-editor";

export interface IMonacoWrapperProps {
  content: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  className?: string;
  language: string;
}

loader.init().then((monaco) => {
  monaco.editor.defineTheme('vs-dark-v2', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e293b80',
      },
  });
  monaco.editor.defineTheme('vs-light-v2', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': 'muted',
    },
});
});

export function MonacoWrapper({content, options, className, language}: IMonacoWrapperProps): JSX.Element {
  const [theme, setTheme] = React.useState('vs-dark');

  React.useEffect(() => {
    const updateTheme = () => {
      if (document.documentElement.classList.contains('light')) {
        setTheme('vs-light-v2');
      } else {
        setTheme('vs-dark-v2');
      }
    };

    updateTheme();

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
    <div className={`w-11/12 border border-muted-foreground ${className} overflow-hidden`}>
      <Editor
        height={8 + 21 * content.split('\n').length}
        width={"100%"}
        defaultLanguage={language}
        defaultValue={content}
        key={content.length}
        theme={theme}
        options={{
          fontSize: 14,
          readOnly: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          roundedSelection: true,
          minimap: {
            enabled: false,
          },
        }}
      />
      </div>
  );
}
