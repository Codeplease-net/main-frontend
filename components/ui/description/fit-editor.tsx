import * as React from "react";
import Editor, { loader, Monaco } from "@monaco-editor/react";


import CopyButton from "../copy-button";

const THEMES = {
  "custom-vs-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#020817",
      "editor.lineHighlightBackground": "#1a2234",
      "editorCursor.foreground": "#7c85f3",
      "editor.selectionBackground": "#2a3957",
    },
  },
  "github-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#0d1117",
      "editor.lineHighlightBackground": "#161b22",
      "editorCursor.foreground": "#58a6ff",
      "editor.selectionBackground": "#1f2937",
    },
  },
  monokai: {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#272822",
      "editor.lineHighlightBackground": "#3e3d32",
      "editorCursor.foreground": "#f8f8f2",
      "editor.selectionBackground": "#49483e",
    },
  },
  'mathjax-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A9955" },
      { token: "comment.content", foreground: "6A9955" },
  
      // Delimiters (e.g. <, >, =)
      { token: "delimiter", foreground: "808080" },
      { token: "delimiter.angle", foreground: "808080" },
  
      // Tag names
      { token: "tag.name", foreground: "569CD6" },
  
      // Normal attributes
      { token: "attribute.name", foreground: "9CDCFE" },
      { token: "attribute.value", foreground: "CE9178" },
  
      // Special link/href attributes
      { token: "tag.href", foreground: "569CD6", fontStyle: "bold" },
      { token: "string.link", foreground: "3DC9B0" },
  
      // Math
      { token: "math.inline", foreground: "FF9D00", fontStyle: "italic" },
      { token: "math.block", foreground: "DCDCAA", fontStyle: "italic" },
  
      // Content
      { token: "content", foreground: "D4D4D4" },
      ],
    colors: {
      "editor.background": "#020817",
      "editor.lineHighlightBackground": "#1a2234",
      "editorCursor.foreground": "#7c85f3",
      "editor.selectionBackground": "#2a3957",
    },
  },
   'mathjax-light':{
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '008000' },
      { token: 'comment.content', foreground: '008000' },
  
      { token: 'tag.name', foreground: '800000' },
      { token: 'delimiter.angle', foreground: '666666' },
  
      { token: 'attribute.name', foreground: 'FF0000' },
      { token: 'attribute.value', foreground: '0000FF' },
      { token: 'delimiter', foreground: '666666' },
  
      { token: 'math.inline', foreground: 'B31111', fontStyle: 'italic' },
      { token: 'math.block', foreground: 'AA00AA', fontStyle: 'italic' },
  
      { token: 'content', foreground: '000000' },
    ],
    colors: {
      "editor.background": "#020817",
      "editor.lineHighlightBackground": "#1a2234",
      "editorCursor.foreground": "#7c85f3",
      "editor.selectionBackground": "#2a3957",
    },
  }
};

// Initialize Monaco themes
loader.init().then((monaco) => {
  Object.entries(THEMES).forEach(([name, theme]) => {
    monaco.editor.defineTheme(name, theme as any);
  });
  monaco.languages.register({ id: 'mathjaxxml' });

  monaco.languages.setLanguageConfiguration("mathjaxxml", {
    brackets: [
      ["<", ">"],
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "<", close: ">" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
    ],
    surroundingPairs: [
      { open: "<", close: ">" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
    ],
    comments: {
      blockComment: ["<!--", "-->"],
    },
  });

  // 2) Tokenizer with special rule for href or link
  monaco.languages.setMonarchTokensProvider("mathjaxxml", {
    defaultToken: "",
    tokenPostfix: ".xml",

    tokenizer: {
      root: [
        // Comments
        [/<!--/, "comment", "@comment"],

        // Inline math: $...$
        [/\$([^$]|\\\$)*?\$/, "math.inline"],

        // Block math: $$...$$
        [/\$\$([^$]|(\$[^\$]))*\$\$/, "math.block"],

        // Opening tag
        [
          /(<)([\w\-]+)(\s*)/,
          [{ token: "delimiter.angle" }, { token: "tag.name" }, { token: "" }],
          "@tag",
        ],

        // Closing tag
        [/(<\/)([\w\-]+)(\s*)(>)/, ["delimiter.angle", "tag.name", "", "delimiter.angle"]],

        // Text content
        [/[^<$]+/, "content"],
      ],

      // Inside a tag, look for href= / link= as special
      tag: [
        // End of tag
        [/\s*(\/?)>/, ["", "delimiter.angle"], "@pop"],

        // Special: href= or link= 
        [
          /(href|link)(\s*)(=)(\s*)("([^"]*)")/,
          ["tag.href", "", "delimiter", "", "string.link"],
        ],
        // If you want single quotes: 
        // [
        //   /(href|link)(\s*)(=)(\s*)('([^']*)')/,
        //   ["tag.href", "", "delimiter", "", "string.link"],
        // ],

        // Generic attribute
        [
          /([\w\-]+)(\s*)(=)(\s*)(".*?")/,
          ["attribute.name", "", "delimiter", "", "attribute.value"],
        ],

        // Whitespace
        [/\s+/, "white"],
      ],

      comment: [
        [/-->/, "comment", "@pop"],
        [/[^-]+/, "comment.content"],
        [/./, "comment.content"],
      ],
    },
  });

});

interface fitEdtiorXMLProps {
  content: string;
  className?: string;
  onChange: (value: string) => void;
}

export function FitEditorXML({
  content,
  className,
  onChange,
} : fitEdtiorXMLProps){
  const [theme, setTheme] = React.useState("mathjaxXMLDark");

  React.useEffect(() => {
    const updateTheme = () => {
      const isLightMode = document.documentElement.classList.contains("light");
      setTheme(isLightMode ? 'mathjax-light' : 'mathjax-dark');    
    };

    updateTheme();

    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);


  return (
    <div className={`${className} flex-1 relative group rounded-md border`}>
      <CopyButton content={content} classname="absolute top-3 right-3 z-10 
            opacity-0 group-hover:opacity-100
            transition-all duration-200 ease-in-out
            bg-background/70 backdrop-blur-md
            hover:bg-background/90 hover:scale-105
            shadow-lg border border-border/50
            hover:border-border/80 hover:shadow-xl
            active:scale-95"/>

      <Editor
        height={12*2 + 21 * content.split("\n").length}
        width="100%"
        onChange={(value) => onChange(value || "")}
        language='mathjaxxml'
        theme={theme}
        value={content}
        options={{
          fontSize: 14,
          readOnly: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          roundedSelection: true,
          minimap: {
            enabled: false,
          },
          bracketPairColorization: {
            enabled: true,
          },
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          autoIndent: "full",
          dragAndDrop: true,
          links: true,
          mouseWheelZoom: true,
          folding: true,
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
          renderLineHighlight: "all",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
          formatOnType: true,
          padding: { top: 12, bottom: 12 },
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            alwaysConsumeMouseWheel: false,
          },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          overviewRulerLanes: 0,
          renderLineHighlightOnlyWhenFocus: true,
          contextmenu: true,
          fontLigatures: true,
          renderWhitespace: "selection",
        }}
      />
    </div>
  );
}

interface fitEditorProps {
  content: string;
  className?: string;
  language: string;
}


export default function FitEditor({
  content,
  className,
  language,
}: fitEditorProps): JSX.Element {
  const [theme, setTheme] = React.useState("custom-vs-dark");

  React.useEffect(() => {
    const updateTheme = () => {
      const isLightMode = document.documentElement.classList.contains("light");
      setTheme(isLightMode ? "vs-light" : "custom-vs-dark");
    };

    updateTheme();

    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [language]);

  return (
    <div className={`${className} flex-1 relative group rounded-md border`}>
      <CopyButton content={content} classname="absolute top-3 right-3 z-10 
            opacity-0 group-hover:opacity-100
            transition-all duration-200 ease-in-out
            bg-background/70 backdrop-blur-md
            hover:bg-background/90 hover:scale-105
            shadow-lg border border-border/50
            hover:border-border/80 hover:shadow-xl
            active:scale-95"/>

      <Editor
        height={12*2 + 21 * content.split("\n").length}
        width="100%"
        language={language}
        value={content}
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
          bracketPairColorization: {
            enabled: true,
          },
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          autoIndent: "full",
          dragAndDrop: true,
          links: true,
          mouseWheelZoom: true,
          folding: true,
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
          renderLineHighlight: "all",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
          formatOnType: true,
          padding: { top: 12, bottom: 12 },
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            alwaysConsumeMouseWheel: false,
          },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          overviewRulerLanes: 0,
          renderLineHighlightOnlyWhenFocus: true,
          contextmenu: true,
          fontLigatures: true,
          renderWhitespace: "selection",
        }}
      />
    </div>
  );
}