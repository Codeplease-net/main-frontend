import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RenderMathJaxText } from "@/components/ui/description/mathjax";
import { MdContentCopy, MdDone } from "react-icons/md";

// Command categories with examples that show exactly how they render
const commandCategories = [
  {
    name: "Text Formatting",
    description: "Commands to style and format text",
    commands: [
      { 
        cmd: "\\textbf{text}", 
        description: "Bold text",
        example: "Normal text and \\textbf{bold text}",
        notes: "Used for emphasizing important words or phrases." 
      },
      { 
        cmd: "\\bf{text}", 
        description: "Bold text (alternative)",
        example: "Normal text and \\bf{bold text}",
        notes: "Alternative syntax for bold text." 
      },
      { 
        cmd: "\\textit{text}", 
        description: "Italic text",
        example: "Normal text and \\textit{italic text}",
        notes: "Used for book titles, foreign phrases, or light emphasis." 
      },
      { 
        cmd: "\\it{text}", 
        description: "Italic text (alternative)",
        example: "Normal text and \\it{italic text}",
        notes: "Alternative syntax for italic text." 
      },
      { 
        cmd: "\\underline{text}", 
        description: "Underlined text",
        example: "Normal text and \\underline{underlined text}",
        notes: "Draws a line beneath the text." 
      },
      { 
        cmd: "\\emph{text}", 
        description: "Emphasized text",
        example: "Normal text and \\emph{emphasized text}",
        notes: "Renders as underlined text." 
      },
      { 
        cmd: "\\sout{text}", 
        description: "Strikethrough text",
        example: "Normal text and \\sout{crossed out text}",
        notes: "Shows deleted or removed content." 
      },
      { 
        cmd: "\\texttt{text}", 
        description: "Monospace/code font",
        example: "Normal text and \\texttt{code style text}",
        notes: "Used for code examples, file paths, or commands." 
      },
      { 
        cmd: "\\tt{text}", 
        description: "Monospace/code font (alternative)",
        example: "Normal text and \\tt{code style text}",
        notes: "Alternative syntax for monospace text." 
      },
      { 
        cmd: "\\t{text}", 
        description: "Monospace/code font (short)",
        example: "Normal text and \\t{code style text}",
        notes: "Short version for monospace text." 
      },
      { 
        cmd: "\\textsc{text}", 
        description: "Small caps text",
        example: "Normal text and \\textsc{Small Caps Text}",
        notes: "Converts text to small capital letters." 
      },
      { 
        cmd: "\\fbox{text}", 
        description: "Boxed text",
        example: "Normal text and \\fbox{boxed text}",
        notes: "Puts a border around the text." 
      },
      { 
        cmd: "\\boxed{text}", 
        description: "Boxed text (alternative)",
        example: "Normal text and \\boxed{boxed text}",
        notes: "Alternative syntax for boxed text." 
      }
    ]
  },
  {
    name: "Text Size",
    description: "Commands to change text size",
    commands: [
      { 
        cmd: "\\tiny{text}", 
        description: "Very small text (0.7em)",
        example: "Normal text and \\tiny{very small text}",
        notes: "Smallest available text size." 
      },
      { 
        cmd: "\\scriptsize{text}", 
        description: "Smaller text (0.75em)",
        example: "Normal text and \\scriptsize{smaller text}",
        notes: "Slightly larger than tiny text." 
      },
      { 
        cmd: "\\small{text}", 
        description: "Small text (0.85em)",
        example: "Normal text and \\small{small text}",
        notes: "Good for captions or footnotes." 
      },
      { 
        cmd: "\\normalsize{text}", 
        description: "Normal text size (1em)",
        example: "\\large{Larger text} and \\normalsize{reset to normal}",
        notes: "Default text size, useful for resetting size changes." 
      },
      { 
        cmd: "\\large{text}", 
        description: "Large text (1.15em)",
        example: "Normal text and \\large{larger text}",
        notes: "Slightly larger than normal text." 
      },
      { 
        cmd: "\\Large{text}", 
        description: "Larger text (1.3em)",
        example: "Normal text and \\Large{even larger text}",
        notes: "Good for subheadings." 
      },
      { 
        cmd: "\\LARGE{text}", 
        description: "Even larger text (1.45em)",
        example: "Normal text and \\LARGE{much larger text}",
        notes: "For major section headers." 
      },
      { 
        cmd: "\\huge{text}", 
        description: "Very large text (1.75em)",
        example: "Normal text and \\huge{very large text}",
        notes: "For titles and major headings." 
      },
      { 
        cmd: "\\HUGE{text}", 
        description: "Largest text (2em)",
        example: "Normal text and \\HUGE{MAXIMUM SIZED TEXT}",
        notes: "The largest available text size." 
      }
    ]
  },
  {
    name: "Headings",
    description: "Commands for section headings and titles",
    commands: [
      { 
        cmd: "\\section{text}", 
        description: "Major section heading (1.8em)",
        example: "\\section{Introduction}\nThis is the introduction section.",
        notes: "Creates a large, bold section heading." 
      },
      { 
        cmd: "\\subsection{text}", 
        description: "Subsection heading (1.5em)",
        example: "\\subsection{Background}\nThis provides background information.",
        notes: "Creates a medium-sized subsection heading." 
      },
      { 
        cmd: "\\subsubsection{text}", 
        description: "Sub-subsection heading (1.2em)",
        example: "\\subsubsection{Method Details}\nHere are the specific details.",
        notes: "Creates a smaller sub-subsection heading." 
      },
      { 
        cmd: "# Title", 
        description: "Heading level 1 (Markdown style)",
        example: "# Main Title\nThis is the main section.",
        notes: "Alternative Markdown-style syntax for headings." 
      },
      { 
        cmd: "## Title", 
        description: "Heading level 2 (Markdown style)",
        example: "## Subtopic\nThis is a subtopic.",
        notes: "Alternative Markdown-style syntax for headings." 
      }
    ]
  },
  {
    name: "Colors",
    description: "Commands to add color to text",
    commands: [
      { 
        cmd: "\\textcolor{red}{text}", 
        description: "Red text",
        example: "Normal text and \\textcolor{red}{red text}",
        notes: "Color can be any named CSS color (like 'red', 'blue', 'green')." 
      },
      { 
        cmd: "\\textcolor{#0070f3}{text}", 
        description: "Custom color using hex code",
        example: "Normal text and \\textcolor{#0070f3}{blue text using hex code}",
        notes: "You can use any hex color code with the # symbol." 
      },
      { 
        cmd: "\\textcolor{rgb(0,128,0)}{text}", 
        description: "Custom color using RGB format",
        example: "Normal text and \\textcolor{rgb(0,128,0)}{green text using RGB}",
        notes: "RGB format with values from 0-255 for red, green, and blue." 
      }
    ]
  },
  {
    name: "Links",
    description: "Commands for creating hyperlinks",
    commands: [
      { 
        cmd: "\\href{url}{text}", 
        description: "Hyperlink with custom text",
        example: "Visit our website: \\href{https://example.com}{click here}",
        notes: "Creates a clickable link with custom text." 
      },
      { 
        cmd: "\\url{url}", 
        description: "URL with automatic linking",
        example: "Visit our website: \\url{https://example.com}",
        notes: "Displays and links the URL directly." 
      }
    ]
  },
  {
    name: "Special Symbols",
    description: "Commands for special characters and symbols",
    commands: [
      { 
        cmd: "\\bullet", 
        description: "Bullet point symbol •",
        example: "\\bullet First item \\bullet Second item",
        notes: "Used for creating bullet points." 
      },
      { 
        cmd: "\\ldots", 
        description: "Ellipsis symbol ...",
        example: "To be continued\\ldots",
        notes: "Creates a properly spaced ellipsis." 
      },
      { 
        cmd: "--", 
        description: "En dash –",
        example: "Pages 10--20",
        notes: "Used for ranges (like page numbers) and is longer than a hyphen." 
      },
      { 
        cmd: "---", 
        description: "Em dash —",
        example: "This is---believe it or not---true.",
        notes: "Used for breaks in sentences—like this—and is longer than an en dash." 
      },
      { 
        cmd: "\\textregistered", 
        description: "® symbol",
        example: "Brand Name\\textregistered",
        notes: "Registered trademark symbol." 
      },
      { 
        cmd: "\\copyright", 
        description: "© symbol",
        example: "\\copyright 2025 Your Company",
        notes: "Copyright symbol." 
      }
    ]
  },
  {
    name: "Math",
    description: "Commands for mathematical expressions",
    commands: [
      { 
        cmd: "$...$", 
        description: "Inline math expression",
        example: "The formula $E = mc^2$ changed physics forever.",
        notes: "For math embedded within text. Use single dollar signs." 
      },
      { 
        cmd: "$$...$$", 
        description: "Display math expression",
        example: "Newton's second law:\n$$F = ma$$\nThis equation relates force to mass and acceleration.",
        notes: "For standalone equations centered on their own line. Use double dollar signs." 
      },
      { 
        cmd: "\\(...\\)", 
        description: "Alternative inline math",
        example: "The area of a circle is \\(A = \\pi r^2\\)",
        notes: "Alternative syntax for inline math." 
      },
      { 
        cmd: "\\[...\\]", 
        description: "Alternative display math",
        example: "The Pythagorean theorem:\n\\[ a^2 + b^2 = c^2 \\]",
        notes: "Alternative syntax for display math." 
      }
    ]
  },
  {
    name: "Environments",
    description: "LaTeX environments for structured content",
    commands: [
      { 
        cmd: "\\begin{itemize}\\item Item 1\\item Item 2\\end{itemize}", 
        description: "Bulleted list",
        example: "\\begin{itemize}\n\\item First item\n\\item Second item\n\\end{itemize}",
        notes: "Creates an unordered list with bullets." 
      },
      { 
        cmd: "\\begin{enumerate}\\item Item 1\\item Item 2\\end{enumerate}", 
        description: "Numbered list",
        example: "\\begin{enumerate}\n\\item First item\n\\item Second item\n\\end{enumerate}",
        notes: "Creates an ordered list with numbers." 
      },
      { 
        cmd: "\\begin{center}...\\end{center}", 
        description: "Centered text",
        example: "\\begin{center}\nThis text will be centered.\n\\end{center}",
        notes: "Centers all content within the environment." 
      },
      { 
        cmd: "\\begin{detail}\\summary{Title}...\\end{detail}", 
        description: "Collapsible section",
        example: "\\begin{detail}\n\\summary{Click to expand}\nHidden content appears here.\n\\end{detail}",
        notes: "Creates a collapsible section with a clickable summary." 
      },
      { 
        cmd: "\\begin{theorem}...\\end{theorem}", 
        description: "Theorem environment",
        example: "\\begin{theorem}\nFor all integers $n > 0$, $n^2 ≥ n$.\n\\end{theorem}",
        notes: "Formats content as a theorem with styling." 
      },
      { 
        cmd: "\\begin{lemma}...\\end{lemma}", 
        description: "Lemma environment",
        example: "\\begin{lemma}\nIf $a|b$ and $a|c$, then $a|(b+c)$.\n\\end{lemma}",
        notes: "Formats content as a lemma with styling." 
      },
      { 
        cmd: "\\begin{definition}...\\end{definition}", 
        description: "Definition environment",
        example: "\\begin{definition}\nA prime number is a natural number greater than 1 that is not a product of two natural numbers other than 1 and itself.\n\\end{definition}",
        notes: "Formats content as a definition with styling." 
      },
      { 
        cmd: "\\begin{corollary}...\\end{corollary}", 
        description: "Corollary environment",
        example: "\\begin{corollary}\nIf $n$ is even, then $n^2$ is also even.\n\\end{corollary}",
        notes: "Formats content as a corollary with styling." 
      },
      { 
        cmd: "\\begin{proof}...\\end{proof}", 
        description: "Proof environment",
        example: "\\begin{proof}\nSuppose $x > 0$. Then $x^2 > 0$ because the product of two positive numbers is positive.\n\\end{proof}",
        notes: "Formats content as a mathematical proof." 
      }
    ]
  },
  {
    name: "Code Blocks",
    description: "Environments for displaying code",
    commands: [
      { 
        cmd: "\\begin{cpp}...\\end{cpp}", 
        description: "C++ code block",
        example: "\\begin{cpp}\nint main() {\n  cout << \"Hello World!\";\n  return 0;\n}\n\\end{cpp}",
        notes: "Formats and syntax-highlights C++ code." 
      },
      { 
        cmd: "\\begin{java}...\\end{java}", 
        description: "Java code block",
        example: "\\begin{java}\npublic class Hello {\n  public static void main(String[] args) {\n    System.out.println(\"Hello World!\");\n  }\n}\n\\end{java}",
        notes: "Formats and syntax-highlights Java code." 
      },
      { 
        cmd: "\\begin{python}...\\end{python}", 
        description: "Python code block",
        example: "\\begin{python}\ndef greet():\n    print(\"Hello, world!\")\n\ngreet()\n\\end{python}",
        notes: "Formats and syntax-highlights Python code." 
      }
    ]
  },
  {
    name: "Tables",
    description: "Commands for creating tables",
    commands: [
      { 
        cmd: "\\begin{tabular}{|c|c|}...\\end{tabular}", 
        description: "Basic table",
        example: "\\begin{tabular}{|c|c|}\n\\hline\nHeader 1 & Header 2 \\\\\n\\hline\nCell 1 & Cell 2 \\\\\nCell 3 & Cell 4 \\\\\n\\hline\n\\end{tabular}",
        notes: "Creates a table with centered columns and borders. Use c for centered, l for left-aligned, r for right-aligned columns." 
      },
      { 
        cmd: "\\hline", 
        description: "Horizontal line in table",
        example: "\\begin{tabular}{|c|c|}\n\\hline\nHeader 1 & Header 2 \\\\\n\\hline\nContent & Content \\\\\n\\hline\n\\end{tabular}",
        notes: "Adds a horizontal line across the entire table row." 
      },
      { 
        cmd: "\\cline{n-m}", 
        description: "Partial horizontal line",
        example: "\\begin{tabular}{|c|c|c|}\n\\hline\nA & B & C \\\\\n\\hline\nD & E & F \\\\\n\\cline{2-3}\nG & H & I \\\\\n\\hline\n\\end{tabular}",
        notes: "Adds a horizontal line spanning columns n through m." 
      },
      { 
        cmd: "\\multicolumn{n}{align}{text}", 
        description: "Cell spanning multiple columns",
        example: "\\begin{tabular}{|c|c|c|}\n\\hline\n\\multicolumn{3}{|c|}{Title Spanning All Columns} \\\\\n\\hline\nA & B & C \\\\\n\\hline\n\\end{tabular}",
        notes: "Creates a cell that spans n columns with the given alignment." 
      },
      { 
        cmd: "\\multirow{n}{*}{text}", 
        description: "Cell spanning multiple rows",
        example: "\\begin{tabular}{|c|c|}\n\\hline\n\\multirow{2}{*}{Spans} & Top \\\\\n & Bottom \\\\\n\\hline\n\\end{tabular}",
        notes: "Creates a cell that spans n rows. The * specifies the width." 
      }
    ]
  },
  {
    name: "Examples",
    description: "Commands for example blocks",
    commands: [
      { 
        cmd: "\\begin{example}...```...\\end{example}", 
        description: "Input/output example block",
        example: "\\begin{example}\nInput data: [1, 2, 3, 4]\nOutput the sum.\n```\n10\n\\end{example}",
        notes: "The text before ``` is treated as input, and the text after ``` as output." 
      }
    ]
  }
];

export const CommandsList: React.FC = () => {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(cmd);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Formatting Commands</h2>
      <p className="mb-6">
        Use these LaTeX commands to format your text, add mathematical expressions, and more.
        Each command is shown with an example of how it renders.
      </p>
      
      {/* Simple Navigation Menu */}
      <div className="mb-8 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-medium mb-3">Jump to Category:</h3>
        <div className="flex flex-wrap gap-2">
          {commandCategories.map((category) => (
            <a 
              key={category.name}
              href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-md text-sm transition-colors"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>

      {/* Show categories and their commands */}
      {commandCategories.map((category) => (
        <section 
          key={category.name}
          id={category.name.toLowerCase().replace(/\s+/g, '-')}
          className="mb-12 scroll-mt-20"
        >
          <div className="mb-4 pb-2 border-b">
            <h3 className="text-xl font-medium">{category.name}</h3>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          <div className="space-y-4">
            {category.commands.map((command, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="p-4 bg-muted border-b flex justify-between items-center">
                  <div>
                    <code className="font-mono text-primary text-sm font-semibold">{command.cmd}</code>
                    <p className="text-sm text-muted-foreground mt-1">{command.description}</p>
                  </div>
                  <Button 
                    onClick={() => copyToClipboard(command.cmd)} 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {copiedCommand === command.cmd ? (
                      <>
                        <MdDone className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <MdContentCopy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                  <div className="p-4">
                    <h4 className="text-sm font-medium mb-1">Example Code:</h4>
                    <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                      {command.example}
                    </pre>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-medium mb-1">Rendered Result:</h4>
                    <div className="border rounded p-3 min-h-[60px] bg-card">
                      <RenderMathJaxText content={command.example} />
                    </div>
                    {command.notes && (
                      <p className="mt-3 text-sm text-muted-foreground italic">
                        <span className="font-medium">Note:</span> {command.notes}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
        </section>
      ))}
    </div>
  );
};

export default CommandsList;