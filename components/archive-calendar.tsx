"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CuratedRecord } from "@/lib/types";

interface ArchiveCalendarProps {
  archives: CuratedRecord[];
  onSelectDate?: (archive: CuratedRecord | null) => void;
  selectedDate?: Date | null;
  linkPrefix?: string;
}

export function ArchiveCalendar({
  archives,
  onSelectDate,
  selectedDate,
  linkPrefix,
}: ArchiveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Create a map of dates that have archives
  const archiveDates = useMemo(() => {
    const map = new Map<string, CuratedRecord>();
    archives.forEach((archive) => {
      const dateKey = format(new Date(archive.fields.Date), "yyyy-MM-dd");
      map.set(dateKey, archive);
    });
    return map;
  }, [archives]);

  // Get all days to display in the calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const hasArchive = archiveDates.has(dateKey);
          const archive = archiveDates.get(dateKey) || null;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          const dayContent = (
            <>
              {format(day, "d")}
              {hasArchive && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </>
          );

          const dayClasses = `
            relative aspect-square flex items-center justify-center text-sm rounded-md transition-colors
            ${!isCurrentMonth ? "text-muted-foreground/40" : ""}
            ${isSelected ? "bg-primary text-primary-foreground" : ""}
            ${!isSelected && hasArchive ? "hover:bg-accent cursor-pointer font-medium" : ""}
            ${!isSelected && isToday ? "border border-primary" : ""}
            ${!hasArchive ? "cursor-default" : ""}
          `;

          if (hasArchive && linkPrefix) {
            return (
              <Link
                key={day.toISOString()}
                href={`${linkPrefix}/${dateKey}`}
                className={dayClasses}
              >
                {dayContent}
              </Link>
            );
          }

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => hasArchive && onSelectDate?.(archive)}
              disabled={!hasArchive}
              className={dayClasses}
            >
              {dayContent}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Archive available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border border-primary" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
