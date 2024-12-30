import React, { useRef, useEffect } from 'react';

type AutoTextAreaProps = {
    value: string;
    setValue: (value: string) => void;
    minLine: number;
    placeholder: string;
}

type AutoTextArea2Props = {
    value: string;
    setValue: (value: React.ChangeEvent<HTMLTextAreaElement>) => void;
    minLine: number;
    placeholder: string;
}

export function AutoResizingTextarea({
  value,
  setValue,
  minLine,
  placeholder,
}: AutoTextAreaProps) {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
  
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'inherit';
            textarea.style.height = `${Math.max(8 + 20 * minLine, textarea.scrollHeight)}px`; // Set new height
        }
    }

    useEffect(() => {
        adjustHeight();
    }, [value]); // Depend on text state to recalculate height on change

    const onInputValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    }   

    return (
        <textarea
            ref={textareaRef}
            className="bg-muted/50 font-mono text-foreground w-full p-1 text-sm border border-foreground rounded-sm resize-none overflow-hidden"
            placeholder={placeholder}
            value={value}
            onChange={onInputValueChange}
        />
    );
}

export function AutoResizingTextarea2({
    value,
    setValue,
    minLine,
    placeholder,
  }: AutoTextArea2Props) {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
  
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'inherit';
            textarea.style.height = `${Math.max(8 + 20 * minLine, textarea.scrollHeight)}px`; // Set new height
        }
    }

    useEffect(() => {
        adjustHeight();
    }, [value]); // Depend on text state to recalculate height on change
  
      return (
          <textarea
            ref={textareaRef}
            className="bg-muted/50 font-mono text-foreground w-full p-1 text-sm border border-foreground rounded-sm resize-none overflow-hidden"
            placeholder={placeholder}
            value={value}
            onChange={setValue}
          />
      );
  }
  