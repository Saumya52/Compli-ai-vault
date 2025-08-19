import { useState } from "react";
import { Check, ChevronsUpDown, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useClient } from "@/contexts/ClientContext";
import { cn } from "@/lib/utils";

interface ClientSwitcherProps {
  onAddClient?: () => void;
}

export const ClientSwitcher = ({ onAddClient }: ClientSwitcherProps) => {
  const [open, setOpen] = useState(false);
  const { clients, currentClient, setCurrentClient, isLoading } = useClient();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
        <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between bg-background/50 backdrop-blur-sm border-border/50"
        >
          <div className="flex items-center space-x-2 min-w-0">
            <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
            {currentClient ? (
              <div className="flex items-center space-x-2 min-w-0">
                <span className="font-medium truncate">{currentClient.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {currentClient.type}
                </Badge>
              </div>
            ) : (
              <span className="text-muted-foreground">Select client...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search clients..." />
          <CommandList>
            <CommandEmpty>No clients found.</CommandEmpty>
            <CommandGroup heading="Clients">
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.name}
                  onSelect={() => {
                    setCurrentClient(client);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentClient?.id === client.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium truncate">{client.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {client.type}
                        </Badge>
                        {client.pan && (
                          <span className="text-xs text-muted-foreground">
                            PAN: {client.pan}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onAddClient?.();
                  setOpen(false);
                }}
                className="cursor-pointer border-t"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Add new client</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};