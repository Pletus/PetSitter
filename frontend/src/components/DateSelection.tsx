import React from "react";

interface DateSelectionProps {
  onDateSelect: (date: string) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ onDateSelect }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDateSelect(event.target.value); // Llamamos a la función onDateSelect cuando el usuario selecciona una fecha
  };

  return (
    <div>
      <h3>Select a date</h3>
      <input type="date" onChange={handleChange} />
    </div>
  );
};

export default DateSelection;
