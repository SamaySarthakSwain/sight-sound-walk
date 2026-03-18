import { useState, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { useMonuments } from "@/hooks/useMonuments";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MonumentSearchProps {
  onSelect: (monumentId: string) => void;
}

const MonumentSearch: React.FC<MonumentSearchProps> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const { monuments, loading } = useMonuments();
  const [selectedTitle, setSelectedTitle] = useState("");

  return (
    <div className="w-full max-w-lg mx-auto mb-8 px-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start gap-3 glass-panel border-none h-12 text-muted-foreground hover:bg-white/10 transition-all"
          >
            <Search className="w-4 h-4 text-primary" />
            <span>{selectedTitle || "Search famous monuments in Odisha..."}</span>
            {loading && <Loader2 className="ml-auto h-4 w-4 animate-spin opacity-50" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-2rem)] md:w-[512px] p-0 border-none shadow-2xl glass-card">
          <Command className="bg-transparent">
            <CommandInput placeholder="Type to search monuments..." className="h-12 border-none ring-0 focus:ring-0" />
            <CommandList className="max-h-[300px]">
              <CommandEmpty className="py-6 text-center text-sm text-white/40">No monument found.</CommandEmpty>
              <CommandGroup heading="Famous Monuments" className="text-white/40 px-2">
                {monuments.map((m) => (
                  <CommandItem
                    key={m.id}
                    value={m.title}
                    onSelect={() => {
                        setSelectedTitle(m.title);
                        onSelect(m.id);
                        setOpen(false);
                    }}
                    className="flex items-center gap-3 py-3 px-4 cursor-pointer hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-white/90">{m.title}</span>
                      <span className="text-xs text-white/40 truncate max-w-[300px]">{m.location}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonumentSearch;
