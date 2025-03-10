import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RenderMathJaxText } from "@/components/ui/description/mathjax";
import { Badge } from "@/components/ui/badge";
import { createAnnotatedExample } from "./components/ExampleTab";
import { MdContentCopy, MdDone, MdArrowDownward } from "react-icons/md";
import { BookOpen, Code, Edit, CheckSquare, ExternalLink } from "lucide-react";

// Import data
import examples from "./data/examples";

// Import components
import ExampleTab from "./components/ExampleTab";
import EnvironmentsList from "./components/EnvironmentsList";
import CommandsList from "./components/CommandsList";
import BestPractices from "./components/BestPractices";

// Quick reference items
const quickReferenceItems = [
  { type: "Math", syntax: "$x^2 + y^2$", description: "Inline math" },
  { type: "Math", syntax: "$$E = mc^2$$", description: "Display math" },
  { type: "Text", syntax: "\\textbf{bold}", description: "Bold text" },
  { type: "Text", syntax: "\\textit{italic}", description: "Italic text" },
  { type: "List", syntax: "\\begin{itemize}\\item Text\\end{itemize}", description: "Bullet list" },
  { type: "List", syntax: "\\begin{enumerate}\\item Text\\end{enumerate}", description: "Numbered list" },
  { type: "Table", syntax: "\\begin{tabular}{|c|c|}\\hline A & B\\\\\\hline\\end{tabular}", description: "Simple table" },
  { type: "Layout", syntax: "\\begin{center}Content\\end{center}", description: "Center content" },
];

export const MathJaxInstructions: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedQuickRef, setCopiedQuickRef] = useState<string | null>(null);
  
  // References to sections for navigation
  const commandsRef = useRef<HTMLDivElement>(null);
  const environmentsRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);
  const bestPracticesRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyQuickRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuickRef(text);
    setTimeout(() => setCopiedQuickRef(null), 2000);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const annotatedExamples = examples.map(example => createAnnotatedExample(example));

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-10 text-center">
        <Badge className="mb-2" variant="outline">Documentation</Badge>
        <h1 className="text-4xl font-bold mb-4">MathJax & LaTeX Formatting Guide</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Create rich content with mathematical expressions, styled text, tables, and more using LaTeX syntax
        </p>
      </div>

      {/* Quick access toolbar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-3 border-b mb-8 -mx-4 px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToSection(environmentsRef)}
              className="flex items-center gap-1"
            >
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Environments</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToSection(commandsRef)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Commands</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToSection(examplesRef)}
              className="flex items-center gap-1"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Examples</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToSection(bestPracticesRef)}
              className="flex items-center gap-1"
            >
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Best Practices</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-semibold">Getting Started</h2>
          <a 
            href="https://www.mathjax.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>MathJax Official Docs</span>
            <ExternalLink className="h-3 w-3 ml-1"/>
          </a>
        </div>
        
        <p className="mb-6 text-lg">
          MathJax allows you to include beautiful mathematical expressions, formatted text,
          lists, tables, and other rich content directly within your text. Simply
          write using LaTeX commands and our platform will automatically render them.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-5 bg-muted/30 overflow-hidden border-primary/20">
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <Badge variant="outline" className="mr-2 px-1.5 py-0">01</Badge>
              Basic Inline Math
            </h3>
            <div className="mb-3">
              <p className="text-muted-foreground mb-2">Write this:</p>
              <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">The area of a circle is $A = \pi r^2$ where $r$ is the radius.</pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Get this:</p>
              <div className="border p-3 rounded bg-card">
                <RenderMathJaxText content="The area of a circle is $A = \pi r^2$ where $r$ is the radius." />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-muted/30 overflow-hidden border-primary/20">
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <Badge variant="outline" className="mr-2 px-1.5 py-0">02</Badge>
              Basic Display Math
            </h3>
            <div className="mb-3">
              <p className="text-muted-foreground mb-2">Write this:</p>
              <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">{'$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$'}</pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Get this:</p>
              <div className="border p-3 rounded bg-card">
                <RenderMathJaxText content="$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-5 bg-muted/30 overflow-hidden border-primary/20">
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <Badge variant="outline" className="mr-2 px-1.5 py-0">03</Badge>
              Basic Text Formatting
            </h3>
            <div className="mb-3">
              <p className="text-muted-foreground mb-2">Write this:</p>
              <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">{"This is \\textbf{bold}, \\textit{italic}, and \\textcolor{red}{colored} text."}</pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Get this:</p>
              <div className="border p-3 rounded bg-card">
                <RenderMathJaxText content="This is \textbf{bold}, \textit{italic}, and \textcolor{red}{colored} text." />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-muted/30 overflow-hidden border-primary/20">
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <Badge variant="outline" className="mr-2 px-1.5 py-0">04</Badge>
              Basic List
            </h3>
            <div className="mb-3">
              <p className="text-muted-foreground mb-2">Write this:</p>
              <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
{`\\begin{itemize}
  \\item First item
  \\item Second item
\\end{itemize}`}
              </pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Get this:</p>
              <div className="border p-3 rounded bg-card">
                <RenderMathJaxText content={`\\begin{itemize}
  \\item First item
  \\item Second item
\\end{itemize}`} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick reference section */}
      <div className="mb-12">
        <h3 className="text-xl font-medium mb-4">Quick Reference</h3>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 min-w-[600px]">
            {quickReferenceItems.map((item, index) => (
              <Card key={index} className="border p-3 hover:border-primary transition-colors cursor-pointer" onClick={() => copyQuickRef(item.syntax)}>
                <div className="flex justify-between items-start mb-1">
                  <Badge variant="outline" className="font-normal text-xs">
                    {item.type}
                  </Badge>
                  {copiedQuickRef === item.syntax ? (
                    <MdDone className="h-4 w-4 text-success" />
                  ) : (
                    <MdContentCopy className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <pre className="text-xs font-mono overflow-x-auto mb-1">
                  {item.syntax}
                </pre>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main sections */}
      <div ref={environmentsRef} className="scroll-mt-16">
        <EnvironmentsList />
      </div>
      
      <div ref={commandsRef} className="scroll-mt-16">
        <CommandsList />
      </div>

      <div ref={examplesRef} className="mb-10 scroll-mt-16">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-primary" />
          Interactive Examples
        </h2>
        
        <p className="mb-6 text-muted-foreground">
          Explore these interactive examples to see how LaTeX can be used in various contexts.
          Click "Try it" to modify the code and see immediate changes in the rendered output.
        </p>

        <Tabs defaultValue={examples[0].title.toLowerCase().replace(/\s/g, '-')}>
          <TabsList className="mb-4 overflow-x-auto flex w-full">
            {annotatedExamples.map((example, index) => (
              <TabsTrigger 
                key={index} 
                value={example.title.toLowerCase().replace(/\s/g, '-')}
                className="min-w-fit whitespace-nowrap"
              >
                {example.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {annotatedExamples.map((example, index) => (
            <TabsContent 
              key={index} 
              value={example.title.toLowerCase().replace(/\s/g, '-')}
            >
              <ExampleTab 
                example={example}
                index={index}
                copiedIndex={copiedIndex}
                onCopy={copyToClipboard}
              />
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => scrollToSection(bestPracticesRef)}
            className="flex items-center gap-1"
          >
            <span>View Best Practices</span>
            <MdArrowDownward className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div ref={bestPracticesRef} className="scroll-mt-16">
        <BestPractices />
      </div>

      {/* Footer with additional resources */}
      <div className="mt-16 pt-8 border-t">
        <h3 className="text-lg font-medium mb-4">Additional Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a 
            href="https://www.mathjax.org/#docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-4 border rounded-md hover:bg-muted/50 transition-colors flex items-start"
          >
            <div>
              <h4 className="font-medium">Official MathJax Documentation</h4>
              <p className="text-sm text-muted-foreground">Comprehensive guide to MathJax syntax and capabilities.</p>
            </div>
          </a>
          <a 
            href="https://en.wikibooks.org/wiki/LaTeX/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-4 border rounded-md hover:bg-muted/50 transition-colors"
          >
            <h4 className="font-medium">LaTeX Wikibooks</h4>
            <p className="text-sm text-muted-foreground">Free books and guides on LaTeX syntax.</p>
          </a>
          <a 
            href="https://detexify.kirelabs.org/classify.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-4 border rounded-md hover:bg-muted/50 transition-colors"
          >
            <h4 className="font-medium">Detexify</h4>
            <p className="text-sm text-muted-foreground">Draw a symbol to find its LaTeX command.</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MathJaxInstructions;