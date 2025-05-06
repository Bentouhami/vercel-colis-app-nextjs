// src/components/ui/calendar.tsx   (React-19 / RDP-9 / French enabled)

"use client"

import * as React from "react"
import {
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
} from "lucide-react"
import {
    DayPicker,
    type ChevronProps,         // <— exported helper type
} from "react-day-picker"
import { fr } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({
                             className,
                             classNames,
                             showOutsideDays = true,
                             ...props
                         }: CalendarProps) {
    return (
        <DayPicker
            /* --- localisation --- */
            locale={fr}
            weekStartsOn={1}
            showOutsideDays={showOutsideDays}

            /* --- styling (unchanged slots renamed for v9) --- */
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row gap-2",
                month: "flex flex-col gap-4",
                caption: "flex justify-center pt-1 relative items-center w-full",
                caption_label: "text-sm font-medium",
                nav: "flex items-center gap-1",
                button_previous: cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 p-0 opacity-50"
                ),
                button_next: cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 p-0 opacity-50"
                ),
                table: "w-full border-collapse space-x-1",
                head_row: "flex",
                head_cell:
                    "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",

                day: cn(
                    "relative p-0 text-center text-sm focus-within:z-20",
                    props.mode === "range"
                        ? "first:rounded-s-md last:rounded-e-md"
                        : "rounded-md"
                ),
                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "size-8 p-0 font-normal aria-selected:opacity-100"
                ),
                range_start:
                    "rounded-s-md aria-selected:bg-primary aria-selected:text-primary-foreground",
                range_end:
                    "rounded-e-md aria-selected:bg-primary aria-selected:text-primary-foreground",
                selected: "bg-primary text-primary-foreground",
                today: "bg-accent text-accent-foreground",
                outside: "text-muted-foreground",
                disabled: "text-muted-foreground opacity-50",
                range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                hidden: "invisible",

                ...classNames,
            }}

            /* --- single Chevron renderer for v9 --- */
            components={{
                Chevron: ({
                              orientation = "right",
                              className,
                              ...svgProps
                          }: ChevronProps) => {
                    const Icon =
                        orientation === "left"
                            ? ChevronLeft
                            : orientation === "up"
                                ? ChevronUp
                                : orientation === "down"
                                    ? ChevronDown
                                    : ChevronRight
                    return <Icon className={cn("size-4", className)} {...svgProps} />
                },
            }}

            {...props}
        />
    )
}
