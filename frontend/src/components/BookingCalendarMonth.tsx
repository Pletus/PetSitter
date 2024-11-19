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

      return newSelected;
    });
  };

  // Solo llamamos a `onSlotChange` cuando los slots seleccionados cambian,
  // y solo si la selección cambió realmente (evita actualizaciones redundantes).
  useEffect(() => {
    const newSlots = Object.keys(selectedSlots).reduce((acc, date) => {
      acc[date] = Array.from(selectedSlots[date]);
      return acc;
    }, {} as { [key: string]: string[] });

    // Verificamos que haya un cambio antes de llamar a `onSlotChange`
    if (JSON.stringify(newSlots) !== JSON.stringify(selectedSlots)) {
      Object.keys(newSlots).forEach((date) => {
        onSlotChange(date, newSlots[date]);
      });
    }
  }, [selectedSlots]); // Solo dependemos de selectedSlots

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
