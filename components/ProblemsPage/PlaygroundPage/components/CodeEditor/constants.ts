/**
 * Initial template comments for each supported language
 */
export const INITIAL_COMMENTS = {
    python: "# Write your Python solution here\n# Have fun coding!",
    cpp: "// Write your C++ solution here\n// Have fun coding!",
    java: "// Write your Java solution here\n// Have fun coding!",
  };
  
  /**
   * Monaco editor theme definitions
   */
  export const THEMES = {
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
  };