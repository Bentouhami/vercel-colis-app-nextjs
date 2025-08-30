// path: src/components/forms/admins/AgencyComboboxSelector.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getAgenciesLight } from "@/services/frontend-services/agencies/AgencyService";

interface AgencyComboboxSelectorProps<TForm extends FieldValues> {
  form: UseFormReturn<TForm>;
  name?: Path<TForm>; // default 'agencyId'
  label?: string;
  disabled?: boolean;
}

export default function AgencyComboboxSelector<TForm extends FieldValues>({
  form,
  name,
  label = "Agence",
  disabled,
}: AgencyComboboxSelectorProps<TForm>) {
  const fieldName = (name || ("agencyId" as Path<TForm>)) as Path<TForm>;
  const [open, setOpen] = useState(false);
  const [agencies, setAgencies] = useState<{ id: number; name: string }[]>([]);

  const selectedId = form.watch(fieldName) as unknown as number | undefined;

  useEffect(() => {
    getAgenciesLight()
      .then(setAgencies)
      .catch(() => setAgencies([]));
  }, []);

  const selectedLabel = useMemo(() => {
    if (!selectedId) return "";
    const found = agencies.find((a) => a.id === Number(selectedId));
    return found?.name || "";
  }, [agencies, selectedId]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={() => (
        <FormItem>
          <FormLabel>
            {label} <span className="text-red-500 ml-1">*</span>
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={disabled}
              >
                {selectedLabel || "Sélectionner une agence"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher une agence..." />
                <CommandList>
                  <CommandEmpty>Aucune agence trouvée.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {agencies.map((a) => (
                      <CommandItem
                        key={a.id}
                        value={a.name}
                        onSelect={() => {
                          form.setValue(fieldName, (a.id as unknown) as PathValue<TForm, Path<TForm>>);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            Number(selectedId) === a.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {a.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

