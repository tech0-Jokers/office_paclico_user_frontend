"use client"; // shadcnのデザインとイベントを動的に動作させる

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // shadcn-uiのButtonコンポーネント

export default function QRCard({ url, label }) {
  const [qrCodeSrc, setQrCodeSrc] = useState("");

  useEffect(() => {
    const fetchQrCode = async () => {
      const response = await fetch(
        `/api/qrcode?url=${encodeURIComponent(url)}`
      );
      if (response.ok) {
        const blob = await response.blob();
        setQrCodeSrc(URL.createObjectURL(blob));
      } else {
        console.error("QRコードの取得に失敗しました");
      }
    };

    fetchQrCode();
  }, [url]);

  return (
    <div className="border rounded-lg p-4 shadow-md text-center bg-white">
      <h2 className="text-lg font-semibold mb-2">{label}</h2>
      <div className="flex justify-center items-center p-4">
        {qrCodeSrc ? (
          <Image
            src={qrCodeSrc}
            alt={`${label} QRコード`}
            width={200}
            height={200}
          />
        ) : (
          <p>QRコードを生成中...</p>
        )}
      </div>
      <Button
        className="mt-4 bg-purple-600"
        onClick={() => {
          window.location.href = url;
        }}
      >
        {label}へ移動
      </Button>
    </div>
  );
}
