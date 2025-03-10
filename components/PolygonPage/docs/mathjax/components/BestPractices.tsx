import React from 'react';
import { Card } from "@/components/ui/card";
import { RenderMathJaxText } from "@/components/ui/description/mathjax";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Check, AlertTriangle, X, ArrowRight, FunctionSquare } from "lucide-react";
import { FileText, Table, HelpCircle, Type } from "lucide-react";

// Helper component for showing examples
const ExampleCard = ({ title, code, description }: { title: string; code: string; description?: string }) => (
  <Card className="mb-6 overflow-hidden border border-border">
    <div className="p-4 bg-muted border-b border-border">
      <h3 className="font-medium">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
      <div className="p-4">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <span className="mr-1">Code:</span>
        </h4>
        <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
          {code}
        </pre>
      </div>
      <div className="p-4">
        <h4 className="text-sm font-medium mb-2">Rendered Result:</h4>
        <div className="border border-border p-3 rounded bg-card overflow-x-auto">
          <RenderMathJaxText content={code} />
        </div>
      </div>
    </div>
  </Card>
);

// Example comparisons (good vs bad)
const ComparisonExample = ({ title, goodCode, badCode, explanation }: { title: string; goodCode: string; badCode: string; explanation: string }) => (
  <div className="mb-6">
    <h3 className="font-medium text-base mb-3">{title}</h3>
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="border border-success/30 overflow-hidden">
        <div className="p-3 bg-success/10 border-b flex items-center">
          <Check className="h-4 w-4 text-success mr-2" />
          <h4 className="text-sm font-medium">Recommended</h4>
        </div>
        <div className="p-4 space-y-3">
          <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
            {goodCode}
          </pre>
          <div className="border border-border p-3 rounded bg-card overflow-x-auto">
            <RenderMathJaxText content={goodCode} />
          </div>
        </div>
      </Card>

      <Card className="border border-destructive/30 overflow-hidden">
        <div className="p-3 bg-destructive/10 border-b flex items-center">
          <X className="h-4 w-4 text-destructive mr-2" />
          <h4 className="text-sm font-medium">Avoid</h4>
        </div>
        <div className="p-4 space-y-3">
          <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
            {badCode}
          </pre>
          <div className="border border-border p-3 rounded bg-card overflow-x-auto">
            <RenderMathJaxText content={badCode} />
          </div>
        </div>
      </Card>
    </div>
    <p className="text-sm mt-3 text-muted-foreground">{explanation}</p>
  </div>
);

export const BestPractices: React.FC = () => {
  return (
    <div className="space-y-8 mt-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">MathJax Best Practices & Examples</h2>
        <p className="text-muted-foreground">
          Follow these guidelines to create well-structured, readable content that renders correctly and performs optimally.
        </p>
      </div>

      <Tabs defaultValue="structure" className="w-full">
        <TabsList className="w-full h-auto flex flex-wrap mb-0 gap-x-1 gap-y-2 bg-transparent p-0">
          {[
            { value: "structure", icon: FileText, label: "Document Structure" },
            { value: "tables", icon: Table, label: "Tables" },
            { value: "math", icon: FunctionSquare, label: "Mathematics" },
            { value: "troubleshooting", icon: HelpCircle, label: "Troubleshooting" },
            { value: "formatting", icon: Type, label: "Text Formatting" }
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-border  
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
                data-[state=active]:border-primary data-[state=active]:shadow-sm
                hover:bg-muted/30 transition-all font-medium min-w-[140px] justify-center"
            >
              <tab.icon className="h-4 w-4 flex-shrink-0" />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mt-4 p-6 border border-border rounded-md shadow-sm">
          <TabsContent value="structure" className="m-0">
            <h3 className="text-lg font-medium">Document Structure Best Practices</h3>
            <ComparisonExample
              title="1. Use blank lines between paragraphs"
              goodCode={`First paragraph with some text.

Second paragraph with more information.

Third paragraph continues the explanation.`}
              badCode={`First paragraph with some text.
Second paragraph more information.
Third paragraph continues the explanation.`}
              explanation="Always separate paragraphs with blank lines for proper spacing. This improves readability and ensures correct paragraph rendering."
            />

            <ComparisonExample
              title="2. Nest environments properly"
              goodCode={`\\begin{center}
  Centered content

  \\begin{itemize}
    \\item First centered item
    \\item Second centered item
  \\end{itemize}
\\end{center}`}
              badCode={`\\begin{center}
  Centered content

  \\begin{itemize}
    \\item First centered item
    \\item Second centered item
\\end{center}
\\end{itemize}`}
              explanation="Always ensure your \\begin and \\end tags are properly nested. Incorrect nesting will cause rendering errors."
            />

            <ExampleCard
              title="3. Organize content with headings"
              code={`\\huge{Main Title}

\\Large{Section 1: Introduction}

Regular text for the introduction paragraph.

\\Large{Section 2: Methodology}

Description of the methods used.

\\Large{Section 3: Results}

Presentation of key findings.`}
              description="Use consistent heading sizes to create visual hierarchy in your document."
            />

            <ExampleCard
              title="4. Use environment blocks for structured content"
              code={`\\begin{detail}
\\summary Important information section

This section contains critical information:

\\begin{itemize}
  \\item Key point 1
  \\item Key point 2
  \\item Key point 3
\\end{itemize}
\\end{detail}`}
              description="Use collapsible detail sections to organize complex information without overwhelming readers."
            />

            <ExampleCard
              title="5. Using Detail Sections Properly"
              code={`\\begin{detail}
\\summary{Collapsible Section Title}
This content will be hidden until expanded.
\\end{detail}

// Alternative syntax:
\\begin{detail}
\\summary Plain text summary
Content goes here.
\\end{detail}

// If no summary specified, first line becomes the summary:
\\begin{detail}
Default Summary Line
The rest becomes content.
\\end{detail}`}
              description="Three ways to specify summaries in detail environments: with braces, without braces, or using the first line as summary."
            />
          </TabsContent>
          
          <TabsContent value="tables" className="m-0">
            <h3 className="text-lg font-medium">Table Formatting Best Practices</h3>

            <ExampleCard
              title="1. Basic table structure"
              code={`\\begin{tabular}{|c|c|c|}
\\hline
Column 1 & Column 2 & Column 3 \\\\
\\hline
Cell 1 & Cell 2 & Cell 3 \\\\
Cell 4 & Cell 5 & Cell 6 \\\\
\\hline
\\end{tabular}`}
              description="Use the tabular environment with column specifications: l (left), c (center), r (right)"
            />

            <ExampleCard
              title="2. Align table columns appropriately"
              code={`\\begin{tabular}{|l|c|r|}
\\hline
Left-aligned & Center-aligned & Right-aligned \\\\
\\hline
Text column & Mixed content & 123.45 \\\\
Longer text & $x^2 + y^2$ & 67.8 \\\\
\\hline
\\end{tabular}`}
              description="Use left alignment for text, center for mixed content, and right alignment for numbers."
            />

            <ExampleCard
              title="3. Spanning rows and columns"
              code={`\\begin{tabular}{|c|c|c|}
\\hline
\\multicolumn{3}{|c|}{Table Title} \\\\
\\hline
Column 1 & Column 2 & Column 3 \\\\
\\hline
\\multirow{2}{*}{Spanning} & Cell 1 & Cell 2 \\\\
& Cell 3 & Cell 4 \\\\
\\hline
\\end{tabular}`}
              description="Use \\multicolumn{cols}{align}{content} to span columns and \\multirow{rows}{*}{content} to span rows."
            />

            <ComparisonExample
              title="4. Center tables for better presentation"
              goodCode={`\\begin{center}
\\begin{tabular}{|c|c|}
\\hline
Item & Value \\\\
\\hline
A & 10 \\\\
B & 20 \\\\
\\hline
\\end{tabular}
\\end{center}`}
              badCode={`\\begin{tabular}{|c|c|}
\\hline
Item & Value \\\\
\\hline
A & 10 \\\\
B & 20 \\\\
\\hline
\\end{tabular}`}
              explanation="Wrap tables in a center environment for better alignment on the page."
            />

            <ExampleCard
              title="5. Table Best Practices"
              code={`\\begin{center}
\\begin{tabular}{|l|c|r|}
\\hline
\\textbf{Left} & \\textbf{Center} & \\textbf{Right} \\\\
\\hline
Text & $x^2$ & 123 \\\\
\\hline
\\multicolumn{2}{|l|}{Spanning columns} & 456 \\\\
\\hline
\\multirow{2}{*}{Two rows} & A & 10 \\\\
 & B & 20 \\\\
\\hline
\\end{tabular}
\\end{center}`}
              description="Combine column alignment (l/c/r), formatting, multirow, and multicolumn for professional tables."
            />
          </TabsContent>
          
          <TabsContent value="math" className="m-0">
            <h3 className="text-lg font-medium">Mathematics Best Practices</h3>

            <ComparisonExample
              title="1. Use display math for complex equations"
              goodCode={`For complex equations, use display math:

$$\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

This improves readability.`}
              badCode={`For complex equations, use inline math: $\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$ which is harder to read.`}
              explanation="Display math ($$...$$) gives equations more space and centers them, making complex expressions easier to read."
            />

            <ExampleCard
              title="2. Use aligned environments for equation systems"
              code={`$$\\begin{aligned}
x + y &= 10 \\\\
2x - y &= 5
\\end{aligned}$$

The solution is $x = 5$ and $y = 5$.`}
              description="Use aligned environments to create properly formatted equation systems with alignment points."
            />

            <ExampleCard
              title="3. Define and reuse mathematical expressions"
              code={`Let $\\mathcal{R}$ be our region of interest.

When integrating over $\\mathcal{R}$, we compute:

$$\\iint_{\\mathcal{R}} f(x,y) \\, dx \\, dy$$`}
              description="Define symbols and notations before using them in complex expressions."
            />

            <ExampleCard
              title="4. Mathematical environments"
              code={`\\begin{theorem}
For any triangle with sides $a$, $b$, and $c$:
$$a^2 + b^2 > c^2$$
if and only if the angle between sides $a$ and $b$ is acute.
\\end{theorem}

\\begin{proof}
Let $\\theta$ be the angle between sides $a$ and $b$.
By the law of cosines:
$$c^2 = a^2 + b^2 - 2ab\\cos\\theta$$

Therefore, $a^2 + b^2 > c^2$ if and only if $2ab\\cos\\theta > 0$,
which is true if and only if $\\cos\\theta > 0$,
which means $\\theta$ is acute.
\\end{proof}`}
              description="Use theorem, lemma, definition, corollary, and proof environments to format mathematical content appropriately."
            />

            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertTitle>Performance tip</AlertTitle>
              <AlertDescription>
                Very complex mathematical expressions may slow down rendering. If you have many equations, consider breaking your content into smaller sections.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="troubleshooting" className="m-0">
            <h3 className="text-lg font-medium">Common Issues & Fixes</h3>

            <Card className="p-4 mb-4">
              <h4 className="font-medium mb-2">Problem: Math not rendering properly</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-destructive">Incorrect:</div>
                  <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto">
                    Here is a formula $E=mc^2$ that uses $ to delimit math.
                  </pre>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-success">Fix:</div>
                  <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto">
                    Here is a formula $E=mc^2$ that uses \$ to delimit math.
                  </pre>
                  <div className="text-sm text-muted-foreground">
                    Ensure $ symbols are properly paired and escape literal $ with \$.
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 mb-4">
              <h4 className="font-medium mb-2">Problem: Mismatched environment tags</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-destructive">Incorrect:</div>
                  <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto">
                    {`\\begin{itemize}
  \\item First item
  \\item Second item
\\end{enumerate}`}
                  </pre>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-success">Fix:</div>
                  <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto">
                    {`\\begin{itemize}
  \\item First item
  \\item Second item
\\end{itemize}`}
                  </pre>
                  <div className="text-sm text-muted-foreground">
                    Always ensure environment closing tag matches the opening tag.
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 mb-4">
              <h4 className="font-medium mb-2">Problem: Table column mismatch</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-destructive">Incorrect:</div>
                  <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto">
                    {`\\begin{tabular}{|c|c|}
\\hline
A & B & C \\\\
\\hline
1 & 2 & 3 \\\\
\\hline
\\end{tabular}`}
                  </pre>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-success">Fix:</div>
                  <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto">
                    {`\\begin{tabular}{|c|c|c|}
\\hline
A & B & C \\\\
\\hline
1 & 2 & 3 \\\\
\\hline
\\end{tabular}`}
                  </pre>
                  <div className="text-sm text-muted-foreground">
                    Ensure your column specification {`{|c|c|c|}`} matches the number of columns in your rows.
                  </div>
                </div>
              </div>
            </Card>

            <Alert className="bg-primary/10 border-primary/20 mb-4">
              <AlertTitle>Debugging Tip</AlertTitle>
              <AlertDescription>
                If your content isn't rendering as expected, try adding one section at a time to identify which part is causing the issue.
              </AlertDescription>
            </Alert>

            <Alert className="my-4 border-amber-200">
              <AlertTitle>Performance Tips</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>If your document renders slowly, try these optimizations:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Break complex content into multiple detail sections</li>
                  <li>Avoid unnecessary nesting of formatting commands</li>
                  <li>Use display math ($$...$$) for complex equations instead of inline math</li>
                  <li>For very long documents, consider splitting content into separate sections</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="mt-6">
              <h3 className="font-medium mb-3">Common Syntax Reminders</h3>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <strong>Escaping special characters:</strong> Use backslash to escape special characters: <code>\$</code> for a literal dollar sign, <code>\\</code> for a literal backslash
                </li>
                <li>
                  <strong>Line breaks in tables:</strong> Use <code>\\\\</code> to end table rows (double backslash)
                </li>
                <li>
                  <strong>Ampersands in tables:</strong> Use <code>\&</code> to display a literal ampersand, since <code>&</code> is used as the column separator
                </li>
                <li>
                  <strong>Math mode brackets:</strong> In math mode, use <code>\{`{`}</code> and <code>\{`}`}</code> for curly braces
                </li>
                <li>
                  <strong>Blank lines:</strong> Use blank lines between paragraphs, but not inside environments like tabular
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="formatting" className="m-0">
            <h3 className="text-lg font-medium">Text Formatting Best Practices</h3>
            
            <ExampleCard
              title="1. Nesting Format Commands"
              code={`\\textbf{Bold text with \\textit{bold italic} text}

\\textcolor{blue}{Blue text with \\textbf{bold blue} text}

\\Large{Large text with \\texttt{monospace large} text}`}
              description="Format commands can be nested to combine different styles."
            />
            
            <ExampleCard
              title="2. Boxed Text Options"
              code={`\\fbox{Content in a box with borders}

\\boxed{Alternative boxed content}

\\fbox{\\textbf{Bold boxed content}}`}
              description="Use \\fbox or \\boxed to add a border around text or other formatted content."
            />
            
            <ComparisonExample
              title="3. Color Usage"
              goodCode={`\\textcolor{#0070f3}{Important information}

\\textcolor{rgb(0,128,0)}{Success message}

\\textcolor{red}{Warning text}`}
              badCode={`\\textcolor{weird-color}{This won't work}

Text with non-closing \\textcolor{red}{tags

Too {\\textcolor{blue}{deeply}} nested`}
              explanation="Use standard color names, hex codes, or RGB values. Ensure color tags are properly closed and not excessively nested."
            />
          </TabsContent>
        </div>
      </Tabs>

      <div className="bg-accent/10 p-6 rounded-lg mt-8">
        <h3 className="text-lg font-medium mb-4">Advanced Tips for Power Users</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 h-full">
            <h4 className="font-medium mb-2 flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Nesting Multiple Environments
            </h4>
            <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto mb-3">
{`\\begin{center}
  \\begin{tabular}{|c|c|}
    \\hline
    Item & Description \\\\
    \\hline
    1 & First item \\\\
    2 & Second item \\\\
    \\hline
  \\end{tabular}
\\end{center}`}
            </pre>
            <p className="text-sm text-muted-foreground">
              Combine environments to create complex layouts. Just make sure to properly nest the begin/end tags.
            </p>
          </Card>

          <Card className="p-4 h-full">
            <h4 className="font-medium mb-2 flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Using Detail Sections Effectively
            </h4>
            <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto mb-3">
{`\\begin{detail}
\\summary Click for solution approach

\\begin{enumerate}
  \\item Initialize variables
  \\item Set up the recursion
  \\item Solve the base cases
  \\item Implement the general case
\\end{enumerate}
\\end{detail}`}
            </pre>
            <p className="text-sm text-muted-foreground">
              Use detail sections to hide complex content that isn't immediately necessary for all readers.
            </p>
          </Card>

          <Card className="p-4 h-full">
            <h4 className="font-medium mb-2 flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Text Formatting Combinations
            </h4>
            <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto mb-3">
{`\\textbf{\\textit{Bold and italic text}}

\\textcolor{red}{\\textbf{Bold red text}}

\\large{\\textbf{Large bold text}}`}
            </pre>
            <p className="text-sm text-muted-foreground">
              Combine formatting commands by nesting them to create rich text styling.
            </p>
          </Card>

          <Card className="p-4 h-full">
            <h4 className="font-medium mb-2 flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Code Examples with Input/Output
            </h4>
            <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto mb-3">
{`\\begin{python}
def calculate_factorial(n):
    if n == 0:
        return 1
    return n * calculate_factorial(n-1)
\\end{python}

\\begin{example}
Input: calculate_factorial(5)
Output: 120

\`\`\`
Step 1: 5 * factorial(4)
Step 2: 5 * 4 * factorial(3)
Step 3: 5 * 4 * 3 * factorial(2)
Step 4: 5 * 4 * 3 * 2 * factorial(1)
Step 5: 5 * 4 * 3 * 2 * 1 = 120
\`\`\`
\\end{example}`}
            </pre>
            <p className="text-sm text-muted-foreground">
              Combine code blocks with examples to show both implementation and execution.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BestPractices;