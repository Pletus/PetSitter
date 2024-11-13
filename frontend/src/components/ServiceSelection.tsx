import React from "react";

interface ServiceSelectionProps {
  services: string[];
  onSelect: (service: string) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ services, onSelect }) => {
  return (
    <div>
      <h3>Select a service</h3>
      <ul>
        {services.map((service, index) => (
          <li key={index} onClick={() => onSelect(service)}>
            {service}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceSelection;
