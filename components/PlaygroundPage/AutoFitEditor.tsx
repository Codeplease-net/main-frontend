import * as React from "react";
import Editor from "@monaco-editor/react";
import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

export interface IMonacoWrapperProps {
  content: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  className?: string;
}

export function MonacoWrapper(props: IMonacoWrapperProps): JSX.Element {
  const [editorHeight, setEditorHeight] = React.useState(0);

  const [theme, setTheme] = React.useState('vs-dark');

  React.useEffect(() => {
    const updateTheme = () => {
      if (document.documentElement.classList.contains('light')) {
        setTheme('light');
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

  function editorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    const scrollHeight = editor.getScrollHeight();
    setEditorHeight(scrollHeight*1.05);
  }

  return (
    <div>
      <Editor
        height={editorHeight}
        defaultLanguage="cpp"
        defaultValue={props.content}
        options={props.options}
        onMount={editorDidMount}
        className={props.className}
        key={props.content.length}
        theme={theme}
      />
    </div>
  );
}
