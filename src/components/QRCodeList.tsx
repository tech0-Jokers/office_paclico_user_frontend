import React from "react";
import QRCard from "@/components/QRCode"; // QRコードカードを表示するコンポーネント

// QRコードリストのプロパティ型を定義
type QRCodeListProps = {
  qrData: { organizationId: string; label: string; qrCodeSrc: string }[]; // QRコードデータ
  onSelect: (id: string) => void; // 選択時に呼ばれる関数
};

// QRコード一覧を表示するコンポーネント
const QRCodeList: React.FC<QRCodeListProps> = ({ qrData, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {qrData.map((item) => (
        <QRCard
          key={item.organizationId} // 一意のキーとして組織IDを使用
          qrCodeSrc={item.qrCodeSrc} // QRコードの画像URL
          label={item.label} // QRコードに関連付けられたラベル
          onClick={() => onSelect(item.organizationId)} // クリック時に選択
        />
      ))}
    </div>
  );
};

export default QRCodeList; // 他のファイルで利用できるようにエクスポート
