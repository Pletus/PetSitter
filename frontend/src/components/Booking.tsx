import React, { useState } from "react";
import ServiceSelection from "./ServiceSelection";
import UserConfirmation from "./UserConfirmation";
import BookingCalendar from "./BookingCalendar";

const Booking: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [userDetails, setUserDetails] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };

  const handleUserConfirm = (name: string, email: string, phone: string) => {
    setUserDetails({ name, email, phone });
    // Aquí podrías hacer una llamada a la API para guardar la cita en la base de datos
  };

  const services = ["Walk", "Home care"];

  return (
    <div className="md:px-32 p-2 md:p-12 bg-violet-100 flex flex-col gap-12">
      <h2>Book your appointment</h2>
      <BookingCalendar />
      <div className="flex md:flex-row justify-center gap-12 items-center">
        <ServiceSelection services={services} onSelect={handleServiceSelect} />
        {
          <>
            <UserConfirmation onConfirm={handleUserConfirm} />
          </>
        }

        {userDetails && (
          <div>
            <h3>Confirm appointment</h3>
            <p>Service: {selectedService}</p>
            <p>Name: {userDetails.name}</p>
            <p>Email: {userDetails.email}</p>
            <p>Phone: {userDetails.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
