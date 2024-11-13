import React, { useState, useEffect } from "react";
import DateSelection from "./DateSelection";
import ServiceSelection from "./ServiceSelection";
import UserConfirmation from "./UserConfirmation";

// Simula una función para obtener los horarios disponibles desde el backend
const getAvailableTimes = (date: string): string[] => {
  // Aquí iría una llamada a la API para obtener los horarios disponibles para la fecha seleccionada
  const availableTimes: { [key: string]: string[] } = {
    "2024-11-13": ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    "2024-11-14": ["11:00 AM", "1:00 PM", "3:00 PM"],
  };

  return availableTimes[date] || [];
};

const Booking: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [userDetails, setUserDetails] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);

  useEffect(() => {
    if (selectedDate) {
      const times = getAvailableTimes(selectedDate); // Simulamos obtener los horarios
      setAvailableTimes(times);
    }
  }, [selectedDate]);

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleUserConfirm = (name: string, email: string, phone: string) => {
    setUserDetails({ name, email, phone });
    // Aquí podrías hacer una llamada a la API para guardar la cita en la base de datos
  };

  const services = ["Walk", "Home care"];

  return (
    <div>
      <h2>Book your appointment</h2>

      {/* Service Selection */}
      <ServiceSelection services={services} onSelect={handleServiceSelect} />

      {selectedService && (
        <>
          {/* Date Selection */}
          <DateSelection onDateSelect={handleDateSelect} />
        </>
      )}

      {selectedDate && availableTimes.length > 0 && (
        <>
          <h3>Available times for {selectedDate}</h3>
          <ul>
            {availableTimes.map((time, index) => (
              <li key={index} onClick={() => handleTimeSelect(time)}>
                {time}
              </li>
            ))}
          </ul>
        </>
      )}

      {selectedTime && (
        <>
          {/* User Confirmation */}
          <UserConfirmation onConfirm={handleUserConfirm} />
        </>
      )}

      {userDetails && selectedTime && (
        <div>
          <h3>Confirm appointment</h3>
          <p>Service: {selectedService}</p>
          <p>Date: {selectedDate}</p>
          <p>Time: {selectedTime}</p>
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Phone: {userDetails.phone}</p>
        </div>
      )}
    </div>
  );
};

export default Booking;
