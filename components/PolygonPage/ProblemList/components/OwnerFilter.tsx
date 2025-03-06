import React, { useState, useMemo, useCallback } from "react";
import { Users, X, Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OwnerFilterProps {
  owners: string[];
  selectedOwners: string[];
  setSelectedOwners: (owners: string[]) => void;
}

export default function OwnerFilter({
  owners,
  selectedOwners,
  setSelectedOwners,
}: OwnerFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState("");

  // Memoized filtered owners list
  const filteredOwners = useMemo(() => {
    if (!owners?.length) return [];
    
    return owners
      .filter((owner) => owner && !selectedOwners.includes(owner))
      .filter((owner) => 
        owner.toLowerCase().includes(ownerSearch.toLowerCase())
      );
  }, [owners, selectedOwners, ownerSearch]);

  // Determine which owners to show in dropdown
  const displayedOwners = useMemo(() => 
    ownerSearch ? filteredOwners : filteredOwners.slice(0, 5),
  [filteredOwners, ownerSearch]);

  // Memoized event handlers for better performance
  const handleSelectOwner = useCallback((owner: string) => {
    setSelectedOwners([...selectedOwners, owner]);
    setOwnerSearch("");
  }, [selectedOwners, setSelectedOwners]);

  const handleRemoveOwner = useCallback((owner: string) => {
    setSelectedOwners(selectedOwners.filter((o) => o !== owner));
  }, [selectedOwners, setSelectedOwners]);

  const handleClearAll = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOwners([]);
    setIsOpen(false);
  }, [setSelectedOwners]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerSearch(e.target.value);
  }, []);

  // Calculate if the dropdown trigger should show placeholder or not
  const showPlaceholder = selectedOwners.length === 0;
  
  // Placeholder text based on selection state
  const placeholderText = selectedOwners.length 
    ? `` 
    : "Filter by owners...";

  return (
    <div className="relative flex-1">
      <Search 
        className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" 
        aria-hidden="true"
      />
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div 
            className="relative cursor-pointer rounded-md" 
            role="combobox" 
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label="Filter by owners"
          >
            <Input
              placeholder={placeholderText}
              className="pl-8 pr-8 w-full min-h-[40px]"
              value=""
              readOnly
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsOpen(true);
                }
              }}
            />
            
            {/* Selected owners tags */}
            <div
              className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-wrap gap-1 mr-8 max-w-[calc(100%-80px)]"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedOwners.length > 0 && (
                <>
                  {selectedOwners.slice(0, 2).map((owner) => (
                    <Badge 
                      key={owner}
                      variant="secondary" 
                      className="text-xs font-normal py-0 h-5 group"
                    >
                      <Users className="h-3 w-3 mr-1 opacity-70" />
                      {owner}
                      <button
                        className="ml-1 text-muted-foreground group-hover:text-foreground"
                        onClick={() => handleRemoveOwner(owner)}
                        aria-label={`Remove ${owner} filter`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  
                  {selectedOwners.length > 2 && (
                    <Badge variant="outline" className="text-xs py-0 h-5">
                      +{selectedOwners.length - 2} more
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="start" className="w-[240px] p-0">
          <div className="p-2 sticky top-0 bg-popover z-10 border-b">
            <Input
              placeholder="Search owners..."
              value={ownerSearch}
              onChange={handleSearchChange}
              className="w-full"
              autoFocus
              aria-label="Search owners"
            />
          </div>
          
          {selectedOwners.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground pt-2 pb-1">
                Selected ({selectedOwners.length})
              </DropdownMenuLabel>
              
              <ScrollArea className="max-h-[120px]">
                {selectedOwners.map((owner) => (
                  <DropdownMenuItem
                    key={`selected-${owner}`}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-primary" />
                      {owner}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveOwner(owner);
                      }}
                      aria-label={`Remove ${owner}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-xs justify-center text-muted-foreground hover:text-destructive"
                onClick={handleClearAll}
              >
                Clear all filters
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {displayedOwners.length > 0 && (
                <DropdownMenuLabel className="text-xs text-muted-foreground pt-2 pb-1">
                  Available owners
                </DropdownMenuLabel>
              )}
            </>
          )}
          
          <ScrollArea className="max-h-[200px]">
            {displayedOwners.length === 0 ? (
              <div className="px-2 py-6 text-sm text-center text-muted-foreground">
                {filteredOwners.length === 0 && selectedOwners.length === owners.length ? (
                  "All owners selected"
                ) : (
                  "No owners found"
                )}
              </div>
            ) : (
              displayedOwners.map((owner) => (
                <DropdownMenuItem
                  key={owner}
                  onClick={() => handleSelectOwner(owner)}
                  className="flex items-center"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {owner}
                </DropdownMenuItem>
              ))
            )}
          </ScrollArea>
          
          {!ownerSearch && filteredOwners.length > 5 && (
            <div className="px-2 py-1.5 text-xs text-center text-muted-foreground border-t">
              {filteredOwners.length - 5} more available. Type to search.
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedOwners.length > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={handleClearAll}
          aria-label="Clear all selected owners"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}