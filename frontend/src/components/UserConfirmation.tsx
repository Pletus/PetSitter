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
    <div className="p-4">
      <h3 className="pl-2">Confirm your details</h3>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
        <button className="text-left pl-2" type="submit">Confirm Appointment</button>
      </form>
    </div>
  );
};

export default UserConfirmation;
