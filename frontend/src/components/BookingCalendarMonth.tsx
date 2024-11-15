import React, { useState } from "react";
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
}

const BookingCalendarMonth: React.FC<BookingCalendarMonthProps> = ({
  monthOffset,
  availability,
}) => {
  const monthStart = startOfMonth(addMonths(new Date(), monthOffset));
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const [selectedSlots, setSelectedSlots] = useState<{
    [key: string]: Set<string>;
  }>({});
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());

  // Función para alternar la selección de un horario específico
  const toggleSlotSelection = (date: string, time: string) => {
    setSelectedSlots((prevSelected) => {
      const newSelected = { ...prevSelected };

      if (!newSelected[date]) {
        newSelected[date] = new Set();
      } else {
        // Crear un nuevo Set para garantizar cambios detectables por React
        newSelected[date] = new Set(newSelected[date]);
      }

      if (newSelected[date].has(time)) {
        newSelected[date].delete(time); // Desmarcar el horario
      } else {
        newSelected[date].add(time); // Marcar el horario
      }

      // Verificar si todos los horarios están seleccionados
      const allSlots = availability[date] || [];
      const areAllSlotsSelected = allSlots.every((slot) =>
        newSelected[date]?.has(slot)
      );

      // Actualizar el estado de selectedDays
      setSelectedDays((prevDays) => {
        const updatedDays = new Set(prevDays);
        if (areAllSlotsSelected) {
          updatedDays.add(date);
        } else {
          updatedDays.delete(date);
        }
        return updatedDays;
      });

      // Eliminar el día si no hay horarios seleccionados
      if (newSelected[date].size === 0) {
        delete newSelected[date];
      }

      return newSelected;
    });
  };

  // Función para alternar la selección de un día completo
  const toggleDaySelection = (date: string) => {
    setSelectedDays((prevSelectedDays) => {
      const newSelectedDays = new Set(prevSelectedDays);

      if (newSelectedDays.has(date)) {
        newSelectedDays.delete(date);

        // Si desmarcamos el día, desmarcamos todos los horarios
        setSelectedSlots((prevSlots) => {
          const updatedSlots = { ...prevSlots };
          delete updatedSlots[date];
          return updatedSlots;
        });
      } else {
        newSelectedDays.add(date);

        // Si marcamos el día, seleccionamos todos los horarios disponibles
        setSelectedSlots((prevSlots) => ({
          ...prevSlots,
          [date]: new Set(availability[date]),
        }));
      }

      return newSelectedDays;
    });
  };

  // Función para obtener el nombre del día de la semana
  const getDayName = (date: Date) => {
    const dayIndex = getDay(date); // 0 es domingo, 1 es lunes, etc.
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
      <div className="grid grid-cols-5 gap-1 md:gap-4">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const isWeekendDay = isWeekend(day);
          const isAvailable = availability[dateKey]?.length > 0;
          const isSelectedDay = selectedDays.has(dateKey);
          const selectedDayClass = isSelectedDay
            ? "border-2 border-blue-500"
            : "";

          // Mostrar solo de lunes a viernes
          if (isWeekendDay) return null;

          return (
            <div
              key={dateKey}
              className={`p-2 border rounded ${selectedDayClass} ${
                isAvailable ? "bg-green-100" : "bg-red-200"
              }`}
            >
              <div className="flex flex-col justify-between items-center">
                <span className="text-xs font-semibold">{getDayName(day)}</span>
                <span className="text-lg">{format(day, "d")}</span>

                {isAvailable && (
                  <button
                    onClick={() => toggleDaySelection(dateKey)}
                    className="text-xs bg-blue-500 text-white rounded p-1"
                  >
                    {isSelectedDay ? "Clear" : "Select Day"}
                  </button>
                )}
              </div>
              {isAvailable && (
                <div className="flex justify-around align-center mt-2">
                  <div className="flex flex-col gap-1">
                    <p className="ml-3">AM</p>
                    {["10", "11", "12"].map((time) => (
                      <div
                        key={time}
                        onClick={() => toggleSlotSelection(dateKey, time)}
                        className={`cursor-pointer p-1 text-center rounded ${
                          selectedSlots[dateKey]?.has(time) ? "bg-blue-300" : ""
                        }`}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="ml-3">PM</p>
                    {["15", "16", "17"].map((time) => (
                      <div
                        key={time}
                        onClick={() => toggleSlotSelection(dateKey, time)}
                        className={`cursor-pointer p-1 text-center rounded ${
                          selectedSlots[dateKey]?.has(time) ? "bg-blue-300" : ""
                        }`}
                      >
                        {time}
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
