import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "../ui/form";

import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "../ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "../ui/command";

import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ComboBoxField({
  control,
  name,
  label,
  data,
  labelKey,
  valueKey,
  extraAction,
}) {
  const [open, setOpen] = useState(false)
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? data.find((item) => item[valueKey] === field.value)?.[labelKey]
                    : `Sélectionner ${label.toLowerCase()}`}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
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
                          field.onChange(item[valueKey])
                          if (extraAction) {
                            extraAction(item[valueKey]); 
                          }
                          setOpen(false)
                        }}
                      >
                        {item[labelKey]}
                        <Check
                          className={cn(
                            "ml-auto",
                            item[valueKey] === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
