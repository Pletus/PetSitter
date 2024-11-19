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
  const [selectedSlots, setSelectedSlots] = useState<{ [key: string]: string[] }>({});
  const [appointmentStatus, setAppointmentStatus] = useState<string>("");

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };

  const handleUserConfirm = async (
    name: string,
    email: string,
    phone: string
  ) => {
    setUserDetails({ name, email, phone });

    const userResponse = await fetch("http://localhost:5432/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone }),
    });
    const userData = await userResponse.json();

    if (userData && userData.id) {
      const appointmentResponse = await fetch("http://localhost:5432/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userData.id,
          service: selectedService,
          date: new Date().toISOString(), // Usa la fecha correcta de la cita
          status: "confirmed",
          start_time: selectedSlots["dateKey"]?.[0], // Usa la hora seleccionada
          end_time: selectedSlots["dateKey"]?.[1], // Usa la hora seleccionada
        }),
      });
      const appointmentData = await appointmentResponse.json();

      if (appointmentData && appointmentData.id) {
        // Ahora actualizamos la disponibilidad
        const availabilityUpdateResponse = await fetch(
          `http://localhost:5432/api/availability/${appointmentData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              is_available: false, // Marca la disponibilidad como no disponible
            }),
          }
        );
        const availabilityData = await availabilityUpdateResponse.json();

        if (availabilityData.success) {
          setAppointmentStatus("Cita confirmada y disponibilidad actualizada.");
        } else {
          setAppointmentStatus("Error al actualizar la disponibilidad.");
        }
      } else {
        setAppointmentStatus("Error al crear la cita.");
      }
    } else {
      setAppointmentStatus("Error al crear el usuario.");
    }
  };

  const services = ["Walk", "Home care"];

  return (
    <div className="md:px-32 p-2 md:p-12 bg-violet-100 flex flex-col gap-12">
      <h2>Book your appointment</h2>
      <BookingCalendar onSlotSelection={(slots) => setSelectedSlots(slots)} />
      <div className="flex md:flex-row justify-center gap-12 items-center">
        <ServiceSelection services={services} onSelect={handleServiceSelect} />
        <UserConfirmation onConfirm={handleUserConfirm} />

        {userDetails && (
          <div>
            <h3>Confirm appointment</h3>
            <p>Service: {selectedService}</p>
            <p>Name: {userDetails.name}</p>
            <p>Email: {userDetails.email}</p>
            <p>Phone: {userDetails.phone}</p>
            {appointmentStatus && <p>{appointmentStatus}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
