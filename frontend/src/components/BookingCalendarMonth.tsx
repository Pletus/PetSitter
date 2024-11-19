import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWeekend,
  getDay,
} from "date-fns";

interface BookingCalendarMonthProps {
  monthOffset: number;
  availability: { [key: string]: string[] };
  onSlotChange: (date: string, slots: string[]) => void;
}

const BookingCalendarMonth: React.FC<BookingCalendarMonthProps> = ({
  monthOffset,
  availability,
  onSlotChange,
}) => {
  const monthStart = startOfMonth(addMonths(new Date(), monthOffset));
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const [selectedSlots, setSelectedSlots] = useState<{
    [key: string]: Set<string>;
  }>({});

  useEffect(() => {
    // Recorre todas las fechas en el estado `selectedSlots` y propaga los cambios al padre
    Object.keys(selectedSlots).forEach((date) => {
      const slotsArray = Array.from(selectedSlots[date]);
      onSlotChange(date, slotsArray); // Llama correctamente a la función con dos argumentos
    });
  }, [selectedSlots, onSlotChange]);

  const toggleSlotSelection = (date: string, time: string) => {
    setSelectedSlots((prevSelected) => {
      const newSelected = { ...prevSelected };

      if (!newSelected[date]) {
        newSelected[date] = new Set();
      } else {
        newSelected[date] = new Set(newSelected[date]);
      }

      if (newSelected[date].has(time)) {
        newSelected[date].delete(time);
      } else {
        newSelected[date].add(time);
      }

      if (newSelected[date].size === 0) {
        delete newSelected[date];
      }

      onSlotChange(date, Array.from(newSelected[date] || []));

      return newSelected;
    });
  };

  const getDayName = (date: Date) => {
    const dayIndex = getDay(date);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayNames[dayIndex];
  };

  return (
    <div className="month">
      <h3 className="text-xl font-semibold mb-2">
        {format(monthStart, "MMMM yyyy")}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1 md:gap-4">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const isAvailable = availability[dateKey]?.length > 0;

          if (isWeekend(day)) return null;

          return (
            <div
              key={dateKey}
              className={`p-2 border rounded ${
                isAvailable ? "bg-green-100" : "bg-red-200"
              }`}
            >
              <div className="flex flex-col justify-between items-center">
                <span className="text-xs font-semibold">{getDayName(day)}</span>
                <span className="text-lg">{format(day, "d")}</span>
              </div>
              {isAvailable && (
                <div className="flex justify-around align-center mt-2">
                  <div className="flex flex-col gap-1">
                    {availability[dateKey].map((slot) => (
                      <div
                        key={slot}
                        onClick={() => toggleSlotSelection(dateKey, slot)}
                        className={`cursor-pointer p-1 text-center rounded ${
                          selectedSlots[dateKey]?.has(slot) ? "bg-blue-300" : ""
                        }`}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendarMonth;
