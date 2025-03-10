const examples = [
    {
      title: "Mathematical Expressions",
      description: "Learn how to write both inline and display mathematical expressions with proper formatting",
      code: `This paragraph contains an inline math expression: $E = mc^2$. Inline expressions blend with the text.
  
  For more complex equations, use display math:
  $$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
  
  You can also use alternative syntax for inline math: \\(x^2 + y^2 = z^2\\)
  
  And alternative syntax for display math:
  \\[ \\int_{0}^{\\infty} e^{-x} dx = 1 \\]`,
      annotations: [
        { startLine: 0, text: "Use single dollar signs ($...$) to create inline math that flows with your text", highlight: "Inline Math" },
        { startLine: 2, endLine: 3, text: "Double dollar signs ($$...$$) create centered, standalone equations", highlight: "Display Math" },
        { startLine: 5, text: "\\(...\\) is an alternative way to write inline math", highlight: "Alternative Syntax" },
        { startLine: 7, endLine: 7, text: "\\[...\\] is an alternative way to write display math", highlight: "Alternative Syntax" }
      ],
      keyPoints: [
        { element: "$...$", text: "Inline Math", description: "For mathematical expressions within text" },
        { element: "$$...$$", text: "Display Math", description: "For standalone, centered equations" },
        { element: "\\(...\\)", text: "Alternative Inline", description: "Another way to write inline math" },
        { element: "\\[...\\]", text: "Alternative Display", description: "Another way to write display math" }
      ],
      variations: [
        {
          name: "Matrix",
          code: `The determinant of a 2×2 matrix is calculated as:
  
  $$\\begin{vmatrix} 
  a & b \\\\
  c & d
  \\end{vmatrix} = ad - bc$$
  
  For a system of linear equations:
  $$\\begin{cases}
  3x + 2y = 5 \\\\
  x - y = 1
  \\end{cases}$$`,
          description: "How to format matrices and systems of equations"
        },
        {
          name: "Advanced Notation",
          code: `For summations and integrals:
  
  $$\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}$$
  
  $$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$$
  
  Using limits and fractions:
  $$\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$$`,
          description: "How to write summations, integrals, limits, and fractions"
        }
      ]
    },
    {
      title: "Text Formatting",
      description: "Format text with different styles, sizes, and colors for emphasis and visual hierarchy",
      code: `Regular text can be styled in various ways:
  
  \\textbf{This text is bold} for emphasis.
  \\textit{This text is italic} for book titles or emphasis.
  \\underline{This text is underlined}.
  \\texttt{This is monospace font}, useful for code.
  
  You can also \\textcolor{blue}{color your text} or make it \\textcolor{#FF5733}{custom colored}.
  
  Text can be \\small{smaller} or \\large{larger} based on importance.
  
  For maximum emphasis: \\Large{\\textbf{\\textcolor{red}{Important Note!}}}`,
      annotations: [
        { startLine: 2, text: "\\textbf{...} creates bold text", highlight: "Bold Text" },
        { startLine: 3, text: "\\textit{...} creates italic text", highlight: "Italic Text" },
        { startLine: 4, text: "\\underline{...} adds an underline", highlight: "Underlining" },
        { startLine: 5, text: "\\texttt{...} uses monospace font (like code)", highlight: "Monospace" },
        { startLine: 7, text: "\\textcolor{color}{...} changes text color using named colors or hex codes", highlight: "Text Color" },
        { startLine: 9, text: "\\small{...} and \\large{...} change text size", highlight: "Text Size" },
        { startLine: 11, text: "Formatting commands can be nested for combined effects", highlight: "Combined Formatting" }
      ],
      keyPoints: [
        { element: "\\textbf{...}", text: "Bold Text", description: "Makes text bold for emphasis" },
        { element: "\\textit{...}", text: "Italic Text", description: "Makes text italic for titles or emphasis" },
        { element: "\\textcolor{color}{...}", text: "Colored Text", description: "Changes text color using named colors or hex codes" },
        { element: "\\large{...}", text: "Size Change", description: "Changes text size (many sizes available)" }
      ],
      variations: [
        {
          name: "Size Variants",
          code: `Text sizes from smallest to largest:
  
  \\tiny{Tiny text} for footnotes or asides.
  \\scriptsize{Script size text} slightly larger.
  \\footnotesize{Footnote size} for notes.
  \\small{Small text} for less emphasis.
  \\normalsize{Normal text} default size.
  \\large{Large text} for subheadings.
  \\Large{Larger text} for headings.
  \\LARGE{Even larger} for major sections.
  \\huge{Huge text} for titles.
  \\Huge{Maximum size} for main titles.`,
          description: "The complete range of text size options from tiny to huge"
        },
        {
          name: "Special Formatting",
          code: `Some special text formatting options:
  
  \\textsc{Small Caps Text} for headings.
  \\textsf{Sans-serif font} for modern look.
  \\textrm{Roman font} (the default serif font).
  \\emph{Emphasized text} (context-dependent emphasis).
  \\textmd{Medium weight} (normal weight text).
  
  Text with \\sout{strikethrough} shows deleted content.
  Sub\\textsuperscript{superscript} and super\\textsubscript{subscript} without math mode.`,
          description: "Additional text formatting options beyond basic styles"
        }
      ]
    },
    {
      title: "Lists",
      description: "Create bullet points, numbered lists, and nested lists for structured content",
      code: `\\begin{itemize}
    \\item First bullet point
    \\item Second bullet point
      \\begin{itemize}
        \\item Nested bullet point
        \\item Another nested point
      \\end{itemize}
    \\item Third bullet point
  \\end{itemize}
  
  \\begin{enumerate}
    \\item First numbered item
    \\item Second numbered item
      \\begin{enumerate}
        \\item Sub-item A
        \\item Sub-item B
      \\end{enumerate}
    \\item Third numbered item
  \\end{enumerate}`,
      annotations: [
        { startLine: 0, text: "\\begin{itemize} starts a bulleted list", highlight: "Bullet List" },
        { startLine: 1, endLine: 2, text: "\\item creates each bullet point", highlight: "List Items" },
        { startLine: 3, endLine: 6, text: "You can nest lists by adding another environment inside an item", highlight: "Nested Lists" },
        { startLine: 9, text: "\\begin{enumerate} starts a numbered list", highlight: "Numbered List" },
        { startLine: 12, endLine: 15, text: "Nested numbered lists can have different numbering styles (1,2,3 then a,b,c)", highlight: "Nested Numbered Lists" }
      ],
      keyPoints: [
        { element: "\\begin{itemize}", text: "Bullet Lists", description: "Creates unordered lists with bullet points" },
        { element: "\\begin{enumerate}", text: "Numbered Lists", description: "Creates ordered lists with automatic numbering" },
        { element: "\\item", text: "List Items", description: "Defines each item in a list" },
        { element: "Nesting", text: "Nested Lists", description: "Create hierarchical lists by placing one list inside another" }
      ],
      variations: [
        {
          name: "Description Lists",
          code: `\\begin{description}
    \\item[HTML] HyperText Markup Language, the standard language for web pages
    \\item[CSS] Cascading Style Sheets, for styling web content
    \\item[JavaScript] A programming language for adding interactivity to websites
  \\end{description}`,
          description: "Lists with custom labels or terms, perfect for definitions or glossaries"
        },
        {
          name: "Custom List Styles",
          code: `\\begin{itemize}
    \\item[$\\bullet$] Standard bullet
    \\item[$\\circ$] Circle bullet
    \\item[$\\square$] Square bullet
    \\item[$\\star$] Star bullet
    \\item[$\\rightarrow$] Arrow bullet
  \\end{itemize}`,
          description: "How to customize bullet styles using math symbols"
        }
      ]
    },
    {
      title: "Tables",
      description: "Create structured tables with various alignments, headers, and formatting",
      code: `\\begin{tabular}{|l|c|r|}
    \\hline
    Left & Center & Right \\\\
    \\hline
    Text & Text & Text \\\\
    123 & 456 & 789 \\\\
    \\hline
  \\end{tabular}
  
  \\begin{center}
    \\begin{tabular}{||l|c|c||}
      \\hline
      \\textbf{Name} & \\textbf{Age} & \\textbf{Score} \\\\
      \\hline\\hline
      Alice & 25 & 95 \\\\
      \\hline
      Bob & 22 & 87 \\\\
      \\hline
      Carol & 28 & 92 \\\\
      \\hline
    \\end{tabular}
  \\end{center}`,
      annotations: [
        { startLine: 0, text: "{|l|c|r|} defines column alignments: left, center, right with vertical borders", highlight: "Column Definition" },
        { startLine: 1, text: "\\hline creates horizontal lines between rows", highlight: "Horizontal Lines" },
        { startLine: 2, text: "& separates cells and \\\\ ends the row", highlight: "Table Structure" },
        { startLine: 9, text: "Tables can be nested inside other environments like center", highlight: "Nested Environments" },
        { startLine: 10, text: "||l|c|c|| creates double vertical lines at the edges", highlight: "Double Lines" },
        { startLine: 12, text: "\\hline\\hline creates a double horizontal line", highlight: "Double Lines" }
      ],
      keyPoints: [
        { element: "\\begin{tabular}{|l|c|r|}", text: "Table Definition", description: "Start a table with column alignments: l=left, c=center, r=right" },
        { element: "\\hline", text: "Horizontal Line", description: "Add horizontal lines between rows" },
        { element: "&", text: "Column Separator", description: "Separates cells in a row" },
        { element: "\\\\", text: "Row End", description: "Marks the end of a table row" }
      ],
      variations: [
        {
          name: "Column Spanning",
          code: `\\begin{tabular}{|l|l|l|}
    \\hline
    \\multicolumn{3}{|c|}{\\textbf{Product Comparison}} \\\\
    \\hline
    Product & Price & Rating \\\\
    \\hline
    Phone X & \\$999 & 4.5/5 \\\\
    Phone Y & \\$799 & 4.2/5 \\\\
    \\hline
  \\end{tabular}`,
          description: "How to make cells span multiple columns using \\multicolumn"
        },
        {
          name: "Row Spanning",
          code: `\\begin{tabular}{|l|l|l|}
    \\hline
    Category & Product & Price \\\\
    \\hline
    \\multirow{2}{*}{Electronics} & Laptop & \\$1200 \\\\
    & Tablet & \\$499 \\\\
    \\hline
    \\multirow{2}{*}{Accessories} & Case & \\$49 \\\\
    & Charger & \\$29 \\\\
    \\hline
  \\end{tabular}`,
          description: "How to make cells span multiple rows using \\multirow"
        }
      ]
    },
    {
      title: "Advanced Layout",
      description: "Combine environments and commands for complex document layouts",
      code: `\\begin{center}
    \\Large{\\textbf{Project Summary}}
  \\end{center}
  
  \\begin{detail}
  \\summary Click to see project details
  
    \\begin{itemize}
      \\item \\textbf{Project Name:} MathJax Implementation
      \\item \\textbf{Duration:} 3 months
      \\item \\textbf{Team Size:} 5 members
    \\end{itemize}
  
    \\begin{center}
      \\begin{tabular}{|l|r|}
        \\hline
        \\textbf{Phase} & \\textbf{Budget} \\\\
        \\hline
        Research & \\$5,000 \\\\
        Development & \\$12,000 \\\\
        Testing & \\$3,000 \\\\
        \\hline
      \\end{tabular}
    \\end{center}
  \\end{detail}
  
  The project completion formula: $C(t) = \\frac{W_c}{W_t} \\times 100\\%$
  Where $W_c$ is work completed and $W_t$ is total work.`,
      annotations: [
        { startLine: 0, endLine: 2, text: "Center environment with larger bold text creates a heading", highlight: "Heading" },
        { startLine: 4, endLine: 5, text: "Detail environment creates a collapsible section", highlight: "Collapsible Content" },
        { startLine: 7, endLine: 11, text: "Itemized list with bold text labels creates structured information", highlight: "Structured List" },
        { startLine: 13, endLine: 22, text: "Centered table creates organized financial data", highlight: "Nested Table" },
        { startLine: 24, endLine: 25, text: "Inline math formulas with descriptions explain calculations", highlight: "Formula with Description" }
      ],
      keyPoints: [
        { element: "\\begin{center}", text: "Centering", description: "Centers any content (text, tables, math)" },
        { element: "\\begin{detail}", text: "Collapsible Sections", description: "Creates expandable/collapsible content sections" },
        { element: "\\summary", text: "Collapsible Header", description: "Defines what text shows when section is collapsed" },
        { element: "Nested Environments", text: "Complex Layouts", description: "Combine environments to create advanced structures" }
      ],
      variations: [
        {
          name: "Academic Paper",
          code: `\\begin{theorem}
  For any triangle with sides $a$, $b$, and $c$, and angles $A$, $B$, and $C$, the law of sines states:
  $$\\frac{a}{\\sin(A)} = \\frac{b}{\\sin(B)} = \\frac{c}{\\sin(C)}$$
  \\end{theorem}
  
  \\begin{proof}
  We begin by constructing the altitude $h$ from vertex $C$ to side $c$.
  By trigonometric definitions, we have:
  $$h = a\\sin(B) = b\\sin(A)$$
  
  Therefore:
  $$\\frac{a}{\\sin(A)} = \\frac{b}{\\sin(B)}$$
  
  Similar constructions for other altitudes complete the proof.
  \\end{proof}`,
          description: "Academic formatting with theorem environments and mathematical proofs"
        },
        {
          name: "Programming Tutorial",
          code: `\\begin{center}
    \\Large{\\textbf{Recursive Factorial Algorithm}}
  \\end{center}
  
  \\begin{python}
  def factorial(n):
      if n == 0 or n == 1:
          return 1
      else:
          return n * factorial(n-1)
  \\end{python}
  
  \\begin{example}
  Input: factorial(5)
  Output: 120
  
  \`\`\`
  Execution trace:
  factorial(5) = 5 * factorial(4) = 5 * 24 = 120
  factorial(4) = 4 * factorial(3) = 4 * 6 = 24
  factorial(3) = 3 * factorial(2) = 3 * 2 = 6
  factorial(2) = 2 * factorial(1) = 2 * 1 = 2
  factorial(1) = 1
  \`\`\`
  \\end{example}`,
          description: "Programming example with code blocks and execution traces"
        }
      ]
    }
  ];
  
  export default examples;