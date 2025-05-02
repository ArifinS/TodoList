"use client"

import React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerFieldProps {
  field: {
    value: Date | null
    onChange: (date: Date | null) => void
  }
  placeholder?: string
  className?: string
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  field,
  placeholder = "Select date",
  className,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full flex justify-start items-center pl-3 text-left font-normal",
            !field.value && "text-gray-500",
            "bg-[#2D333F] text-white border border-gray-600 hover:bg-[#343B4A] hover:border-gray-500",
            className
          )}
        >
          {field.value ? (
            format(field.value, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value || undefined}
          onSelect={field.onChange}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          initialFocus
          className="bg-[#2D333F] border border-gray-700 text-white"
        />
      </PopoverContent>
    </Popover>
  )
}