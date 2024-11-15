import React, { useState } from "react";

interface ServiceSelectionProps {
  services: string[];
  onSelect: (service: string) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ services, onSelect }) => {
  const [selectedService, setSelectedService] = useState<string>("");

  const handleSelect = (service: string) => {
    setSelectedService(service);
    onSelect(service); // Llamamos a la función onSelect pasada como prop
  };

  return (
    <div className="flex flex-col p-4">
      <h3>Select a service</h3>
      <ul className="space-y-2">
        {services.map((service, index) => (
          <li
            key={index}
            onClick={() => handleSelect(service)}
            className={`cursor-pointer p-2 rounded ${
              selectedService === service
                ? "bg-blue-500 text-white" // Resalta el servicio seleccionado
                : "bg-gray-200"
            }`}
          >
            {service}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceSelection;

