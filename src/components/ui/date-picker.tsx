"use client";

import * as React from "react";
import {format, getMonth, getYear, setMonth, setYear} from "date-fns";
import {fr} from "date-fns/locale";
import {Calendar as CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./select";
import {ControllerRenderProps} from "react-hook-form";
import {Calendar} from "@/components/ui/calender";

interface DatePickerProps {
    startYear?: number;
    endYear?: number;
    field: ControllerRenderProps<any, any>;
}

export function DatePicker({
                               startYear = getYear(new Date()) - 100,
                               endYear = getYear(new Date()) + 100,
                               field
                           }: DatePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(
        field.value ? new Date(field.value) : undefined
    );
    const [calendarDate, setCalendarDate] = React.useState<Date>(date || new Date());

    const months = Array.from({length: 12}, (_, i) =>
        new Date(2025, i, 1).toLocaleString("fr", {month: "long"})
    )

    const years = Array.from({length: endYear - startYear + 1}, (_, i) => startYear + i);

    const handleMonthChange = (month: string) => {
        const newDate = setMonth(calendarDate, months.indexOf(month));
        setCalendarDate(newDate);
    };

    const handleYearChange = (year: string) => {
        const newDate = setYear(calendarDate, parseInt(year));
        setCalendarDate(newDate);
    };

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            field.onChange(selectedDate);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[250px] justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {date ? format(date, "PPPP", {locale: fr}) : <span>Choisir une date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="flex justify-between p-2">
                    {/* Sélection du mois */}
                    <Select onValueChange={handleMonthChange} value={months[getMonth(calendarDate)]}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Mois"/>
                        </SelectTrigger>
                        <SelectContent>
                            {months.map(month => (
                                <SelectItem key={month} value={month}>{month}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Sélection de l'année */}
                    <Select onValueChange={handleYearChange} value={getYear(calendarDate).toString()}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Année"/>
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(year => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Mise à jour du calendrier */}
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    month={calendarDate} // Définit le mois affiché
                    onMonthChange={setCalendarDate} // Met à jour quand on change de mois directement
                />
            </PopoverContent>
        </Popover>
    );
}
