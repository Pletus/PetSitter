import React, { useState } from "react";

interface UserConfirmationProps {
  onConfirm: (name: string, email: string, phone: string) => void;
}

const UserConfirmation: React.FC<UserConfirmationProps> = ({ onConfirm }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(name, email, phone); // Llamamos a la función onConfirm con los datos del usuario
  };

  return (
    <div>
      <h3>Confirm your details</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Confirm Appointment</button>
      </form>
    </div>
  );
};

export default UserConfirmation;
