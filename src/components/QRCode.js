"use client"; // shadcnのデザインとイベントを動的に動作させる

import Image from "next/image";
import { Button } from "@/components/ui/button"; // shadcn-uiのButtonコンポーネント

export default function QRCard({ qrCodeSrc, label, onClick }) {
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
      <Button className="mt-4 bg-purple-600" onClick={onClick}>
        {label}へ移動
      </Button>
    </div>
  );
}
