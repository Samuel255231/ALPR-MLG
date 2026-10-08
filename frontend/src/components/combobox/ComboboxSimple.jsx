import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComboboxSimple({ label, data, labelKey, valueKey, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col w-[200px]">
      {/* <label className="mb-1 font-medium">{label}</label> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground"
            )}
          >
            <span className="truncate">
              {(() => {
                const text = value
                  ? data.find((item) => item[valueKey] === value)?.[labelKey]
                  : `Sélectionner ${label.toLowerCase()}`;
                return text.length > 18 ? `${text.slice(0, 15)}...` : text;
              })()}
            </span>

            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder={`Rechercher ${label.toLowerCase()}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item[valueKey]}
                    value={item[labelKey]}
                    onSelect={() => {
                      onChange(item[valueKey]);
                      setOpen(false);
                    }}
                  >
                    {item[labelKey]}
                    <Check
                      className={cn(
                        "ml-auto",
                        item[valueKey] === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
