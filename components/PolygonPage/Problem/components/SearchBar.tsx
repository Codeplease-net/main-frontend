import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useHotkeys } from "react-hotkeys-hook";

interface SearchBarProps {
  onSearch: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [searchId, setSearchId] = useState("");
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a problem ID",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSearch(searchId.trim());
      setSearchId("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search problem",
        variant: "destructive",
      });
    }
  };

  // Add keyboard shortcut Cmd/Ctrl + K
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('problem-search');
    searchInput?.focus();
  });

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2">
      <div className="relative">
        <Input
          id="problem-search"
          type="text"
          placeholder="Problem ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-48 pr-8"
          disabled={isLoading}
        />
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          ⌘K
        </kbd>
      </div>
      
      <Button
        size="icon"
        onClick={handleSearch}
        disabled={isLoading}
        className="shrink-0"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}