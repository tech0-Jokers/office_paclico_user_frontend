"use client";

import { useState } from "react";
import QRCard from "@/components/QRCard";
import ChocolateShop from "@/components/AmbassadorShop";

export default function HomePage() {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const qrData = [
    {
      organizationId: "1",
      label: "Office Suzuyu",
    },
    {
      organizationId: "2",
      label: "Office Ryosan",
    },
  ];

  if (selectedOrgId) {
    return <ChocolateShop organizationId={Number(selectedOrgId)} />;
  }

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">OfficePaclico</h1>
      <div>
        <h1 className="text-2xl font-bold">
          あなたが所属するオフィスを選んでください
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qrData.map((item, index) => (
            <QRCard
              key={index}
              url="#"
              label={item.label}
              onClick={() => setSelectedOrgId(item.organizationId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
