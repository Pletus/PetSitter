import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { format } from 'date-fns';
import BookingCalendarMonth from "./BookingCalendarMonth";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BookingCalendar: React.FC = () => {
  const [availability, setAvailability] = useState<{ [key: string]: string[] }>({});
  
  const fetchAvailability = async () => {
    try {
      const response = await fetch("http://localhost:5432/api/availability");
      const data = await response.json();
  
      const formattedAvailability: { [key: string]: string[] } = data.reduce(
        (acc: any, slot: any) => {
          const dateKey = format(new Date(slot.date), "yyyy-MM-dd"); // Asegura el formato ISO aquí
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(`${slot.start_time} - ${slot.end_time}`);
          return acc;
        },
        {}
      );
  
      setAvailability(formattedAvailability);
    } catch (error) {
      console.error("Error fetching availability", error);
    }
  };

  useEffect(() => {
      fetchAvailability();
      console.log(availability)
  }, []);

  // Configuración de react-slick para el carrusel
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="booking-calendar">
      <h2 className="text-2xl font-bold mb-4">Select a Date</h2>
      <Slider {...settings}>
        {[...Array(12).keys()].map((monthOffset) => (
          <BookingCalendarMonth
            key={monthOffset}
            monthOffset={monthOffset}
            availability={availability}
          />
        ))}
      </Slider>
    </div>
  );
};

export default BookingCalendar;