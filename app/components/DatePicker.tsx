"use client"

import React, { useState } from "react"
// import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Control, Controller } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  control: Control<any>
  name: string
  label?: string
  placeholder?: string
  description?: string
}

export function DatePicker({
  control,
  name,
  label = "Date",
  placeholder = "Pick a date",
  description,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col">
          {label && (
            <label className="block mb-1 text-sm font-medium text-gray-300">
              {label}
            </label>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  <span>
                    {(() => {
                      try {
                        return format(field.value, "PPP")
                      } catch (e) {
                        console.error("Date formatting error:", e)
                        return placeholder
                      }
                    })()}
                  </span>
                ) : (
                  <span>{placeholder}</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date)
                  setOpen(false) // Close on date select
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && (
            <p className="mt-1 text-sm text-gray-300">{description}</p>
          )}
          {error && (
            <p className="text-red-400 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  )
}