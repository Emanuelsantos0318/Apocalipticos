// src/components/layout/PageLayout.jsx
import React from "react";

export default function PageLayout({ children }) {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed flex flex-col items-center justify-center text-white relative"
      style={{ backgroundImage: "url('/banner2.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
