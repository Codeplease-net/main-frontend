import * as React from "react";
import Editor, {loader} from "@monaco-editor/react";
import { editor } from "monaco-editor";

export interface IMonacoWrapperProps {
  content: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  className?: string;
  language: string;
}

export function MonacoWrapper({content, options, className, language}: IMonacoWrapperProps): JSX.Element {
  const [theme, setTheme] = React.useState('custom-vs-dark');

  React.useEffect(() => {
    const updateTheme = () => {
      if (document.documentElement.classList.contains('light')) {
        setTheme('vs-light');
      } else {
        setTheme('vs-dark');
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
    <div className={`${className} overflow-hidden rounded-md border`}>
      <Editor
        height={2 + 21 * content.split('\n').length}
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
