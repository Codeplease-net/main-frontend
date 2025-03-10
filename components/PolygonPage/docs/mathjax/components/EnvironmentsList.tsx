import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RenderMathJaxText } from "@/components/ui/description/mathjax";
import { ChevronDown, ChevronUp, CopyIcon, CheckIcon } from "lucide-react";

// Group environments by category for better organization
const environmentCategories = [
  {
    name: "Lists",
    description: "Ordered and unordered lists",
    environments: [
      {
        name: "itemize",
        description: "Bulleted list with \\item elements",
        syntax: "\\begin{itemize}\n  \\item First item\n  \\item Second item\n\\end{itemize}",
        example: "\\begin{itemize}\n  \\item Apples\n  \\item Oranges\n  \\item Bananas\n\\end{itemize}",
        notes: "Use \\item for each bullet point. For nested lists, create a new itemize environment inside an item (but this may have rendering limitations)."
      },
      {
        name: "enumerate",
        description: "Numbered list with \\item elements",
        syntax: "\\begin{enumerate}\n  \\item First item\n  \\item Second item\n\\end{enumerate}",
        example: "\\begin{enumerate}\n  \\item Step one\n  \\item Step two\n  \\item Step three\n\\end{enumerate}",
        notes: "Creates a numbered list. For nested lists, create a new enumerate inside an item (though rendering nested lists may have limitations)."
      }
    ]
  },
  {
    name: "Layout",
    description: "Content alignment and organization",
    environments: [
      {
        name: "center",
        description: "Centers content horizontally",
        syntax: "\\begin{center}\n  Content to center\n\\end{center}",
        example: "\\begin{center}\n  This text will be centered on the page.\n  \n  $$E = mc^2$$\n  \n  Multiple paragraphs will all be centered.\n\\end{center}",
        notes: "Centers all content between the begin and end tags. Works with text, math, tables and more."
      },
      {
        name: "detail",
        description: "Collapsible content with \\summary",
        syntax: "\\begin{detail}\n\\summary Title shown when collapsed\n  Hidden content\n\\end{detail}",
        example: "\\begin{detail}\n\\summary Click to see solution\n  The answer is $x = 42$\n  \n  \\begin{itemize}\n    \\item Step 1: Set up equation\n    \\item Step 2: Solve for x\n  \\end{itemize}\n\\end{detail}",
        notes: "Creates an expandable section. The \\summary tag defines what's shown when collapsed. All content after \\summary is hidden until expanded."
      }
    ]
  },
  {
    name: "Tables",
    description: "Structured data in rows and columns",
    environments: [
      {
        name: "tabular",
        description: "Tables with rows and columns",
        syntax: "\\begin{tabular}{|l|c|r|}\n\\hline\nLeft & Center & Right \\\\\n\\hline\nA & B & C \\\\\n\\hline\n\\end{tabular}",
        example: "\\begin{tabular}{|l|c|r|}\n\\hline\nAlignment & Format & Example \\\\\n\\hline\nLeft & l & Text \\\\\nCenter & c & $x^2$ \\\\\nRight & r & 123.45 \\\\\n\\hline\n\\end{tabular}",
        notes: "Column formats: l (left), c (center), r (right). Add | for vertical lines. Use \\\\ for row end, & for column separator, \\hline for horizontal lines."
      }
    ]
  },
  {
    name: "Code",
    description: "Syntax-highlighted code blocks",
    environments: [
      {
        name: "cpp",
        description: "C++ code with syntax highlighting",
        syntax: "\\begin{cpp}\n// Your C++ code here\n\\end{cpp}",
        example: "\\begin{cpp}\n#include <iostream>\n\nint main() {\n  std::cout << \"Hello World!\" << std::endl;\n  return 0;\n}\n\\end{cpp}",
        notes: "Displays C++ code with proper syntax highlighting."
      },
      {
        name: "java",
        description: "Java code with syntax highlighting",
        syntax: "\\begin{java}\n// Your Java code here\n\\end{java}",
        example: "\\begin{java}\npublic class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, world!\");\n  }\n}\n\\end{java}",
        notes: "Displays Java code with proper syntax highlighting."
      },
      {
        name: "python",
        description: "Python code with syntax highlighting",
        syntax: "\\begin{python}\n# Your Python code here\n\\end{python}",
        example: "\\begin{python}\ndef factorial(n):\n  if n == 0:\n    return 1\n  else:\n    return n * factorial(n-1)\n\nprint(factorial(5))  # Output: 120\n\\end{python}",
        notes: "Displays Python code with proper syntax highlighting."
      }
    ]
  },
  {
    name: "Examples",
    description: "Input/output examples with solution steps",
    environments: [
      {
        name: "example",
        description: "Input/output examples with solution steps",
        syntax: "\\begin{example}\nInput: value\nOutput: result\n\n```\nExplanation steps here\n```\n\\end{example}",
        example: "\\begin{example}\nInput: [1, 3, 5, 7, 9]\nOutput: 25\n\n```\nStep 1: Add all numbers in the array\nStep 2: 1 + 3 + 5 + 7 + 9 = 25\n```\n\\end{example}",
        notes: "Format with Input/Output at the top, followed by explanation steps between triple backticks (```). Great for algorithms and problem solutions."
      }
    ]
  },
  {
    name: "Theorems",
    description: "Mathematical statements and proofs",
    environments: [
      {
        name: "theorem",
        description: "Mathematical theorem statement",
        syntax: "\\begin{theorem}\nYour theorem statement\n\\end{theorem}",
        example: "\\begin{theorem}\nFor any triangle, the sum of the interior angles equals 180 degrees.\n\\end{theorem}",
        notes: "Renders a theorem with proper styling and formatting."
      },
      {
        name: "lemma",
        description: "Supporting statement for a theorem",
        syntax: "\\begin{lemma}\nYour lemma statement\n\\end{lemma}",
        example: "\\begin{lemma}\nIf two lines are perpendicular, their slopes multiply to give -1.\n\\end{lemma}",
        notes: "A lemma is typically used as a stepping stone to prove a larger theorem."
      },
      {
        name: "definition",
        description: "Formal definition of a concept",
        syntax: "\\begin{definition}\nYour definition\n\\end{definition}",
        example: "\\begin{definition}\nA prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.\n\\end{definition}",
        notes: "Used to formally define mathematical terms or concepts."
      },
      {
        name: "corollary",
        description: "Result that follows from a theorem",
        syntax: "\\begin{corollary}\nYour corollary statement\n\\end{corollary}",
        example: "\\begin{corollary}\nThe sum of angles in any quadrilateral equals 360 degrees.\n\\end{corollary}",
        notes: "A corollary is a statement that follows directly from a theorem that has already been proven."
      },
      {
        name: "proof",
        description: "Proof of a theorem or statement",
        syntax: "\\begin{proof}\nYour proof steps\n\\end{proof}",
        example: "\\begin{proof}\nLet angles in the triangle be $a$, $b$, and $c$.\n\nWe can extend one side of the triangle and create a straight line, which has angle 180°.\n\nFrom the properties of corresponding angles, we can show that $a + b + c = 180°$.\n\\end{proof}",
        notes: "Used to provide logical reasoning that demonstrates why a theorem is true."
      }
    ]
  }
];

interface Environment {
  name: string;
  description: string;
  syntax: string;
  example: string;
  notes: string;
}

const EnvironmentExample = ({ env }: { env: Environment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = ({ text }: { text: string }): void => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <div className="p-4 border-b bg-muted flex items-center justify-between">
        <div>
          <h3 className="font-mono text-primary font-medium">
            \begin{`{${env.name}}`}...\end{`{${env.name}}`}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{env.description}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-b">
          <h4 className="text-sm font-medium mb-2">Basic Syntax:</h4>
          <div className="relative">
            <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
              {env.syntax}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => copyToClipboard({ text: env.syntax })}
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{env.notes}</p>
        </div>
      )}

      {isExpanded && (
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="p-4">
            <h4 className="text-sm font-medium mb-2">Example Code:</h4>
            <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
              {env.example}
            </pre>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard({ text: env.example })}
              className="mt-2"
            >
              {copied ? <CheckIcon className="h-4 w-4 mr-1" /> : <CopyIcon className="h-4 w-4 mr-1" />}
              {copied ? "Copied!" : "Copy Example"}
            </Button>
          </div>
          <div className="p-4">
            <h4 className="text-sm font-medium mb-2">Rendered Result:</h4>
            <div className="border p-3 rounded min-h-[150px] bg-card overflow-auto">
              <RenderMathJaxText content={env.example} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export const EnvironmentsList: React.FC = () => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">LaTeX Environments</h2>
      <p className="mb-6">
        Environments provide structure for different types of content. They begin with <code>\begin{'{name}'}</code> and end with <code>\end{'{name}'}</code>. 
        Click on any environment card below to see example code and how it renders.
      </p>

      {/* Simple Navigation Menu */}
      <div className="mb-8 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-medium mb-3">Jump to Category:</h3>
        <div className="flex flex-wrap gap-2">
          {environmentCategories.map((category) => (
            <a 
              key={category.name}
              href={`#${category.name.toLowerCase()}`} 
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-md text-sm transition-colors"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>

      {/* Category Sections */}
      {environmentCategories.map((category) => (
        <section 
          key={category.name} 
          id={category.name.toLowerCase()} 
          className="mb-12 scroll-mt-20"
        >
          <div className="mb-4 pb-2 border-b">
            <h3 className="text-xl font-medium">{category.name} Environments</h3>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          <div className="space-y-4">
            {category.environments.map((env) => (
              <EnvironmentExample key={env.name} env={env} />
            ))}
          </div>

          {category.name === "Tables" && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-2">Table Formatting Tips:</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Column formatting:</strong> Use <code>{'{|l|c|r|}'}</code> where <code>l</code>=left, <code>c</code>=center, <code>r</code>=right, <code>|</code>=vertical line</li>
                <li><strong>Row endings:</strong> End each row with <code>\\</code> (double backslash)</li>
                <li><strong>Cell separator:</strong> Use <code>&</code> between cells</li>
                <li><strong>Horizontal lines:</strong> Add <code>\hline</code> between rows for horizontal lines</li>
                <li><strong>Multi-column cells:</strong> Use <code>\multicolumn{2}{"{c}{Spanning text}"}</code> where 2 is the number of columns to span</li>
                <li><strong>Align decimal points:</strong> For numerical data, use right-alignment (<code>r</code>)</li>
              </ul>
            </div>
          )}

          {category.name === "Code" && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-2">Code Block Best Practices:</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Choose the correct language environment (<code>cpp</code>, <code>java</code>, or <code>python</code>) for proper syntax highlighting</li>
                <li>Indentation will be preserved exactly as written</li>
                <li>Avoid using backslash (<code>\</code>) as the last character on a line</li>
                <li>Combine code blocks with the <code>example</code> environment to show both implementation and execution</li>
              </ul>
            </div>
          )}
          
        </section>
      ))}

      <div className="p-4 bg-accent/10 mt-6 rounded-lg">
        <h3 className="font-medium mb-2">Nesting Environments</h3>
        <p className="mb-4">You can nest environments to create complex layouts. For example, place a table inside a center environment:</p>
        <Card className="overflow-hidden">
          <div className="p-4">
            <h4 className="text-sm font-medium mb-2">Example:</h4>
            <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap mb-2">
{`\\begin{center}
  \\begin{tabular}{|c|c|}
    \\hline
    Item & Value \\\\
    \\hline
    A & 10 \\\\
    B & 20 \\\\
    \\hline
  \\end{tabular}
\\end{center}`}
            </pre>
            <div className="border p-3 rounded bg-card">
              <RenderMathJaxText content={`\\begin{center}
  \\begin{tabular}{|c|c|}
    \\hline
    Item & Value \\\\
    \\hline
    A & 10 \\\\
    B & 20 \\\\
    \\hline
  \\end{tabular}
\\end{center}`} />
            </div>
          </div>
        </Card>
        <p className="mt-4 text-sm text-muted-foreground">
          <strong>Important:</strong> When nesting environments, always make sure to close them in reverse order. The last environment opened should be the first one closed.
        </p>
      </div>
    </div>
  );
};

export default EnvironmentsList;