import React from "react";

export default function LastFourDigits({ phoneNumber }) {
  const lastFour = phoneNumber.replace(/\D/g, "").slice(-4);
  return <span>{lastFour}</span>;
}
