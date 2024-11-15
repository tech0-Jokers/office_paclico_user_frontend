import MessageAppMain from "@/components/MessageApp"; // コンポーネントのインポート
import QRCard from "@/components/QRCard";

export default function HomePage() {
  const qrData = [
    {
      url: "http://localhost:3000/shop?organizationId=1",
      label: "Office Suzuyu",
    },
    {
      url: "http://localhost:3000/shop?organizationId=2",
      label: "Office Ryosan",
    },
  ];
  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">OfficePaclico</h1>
      <div>
        <h1 className="text-2xl font-bold">
          あなたが所属するオフィスを選んでください
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qrData.map((item, index) => (
            <QRCard key={index} url={item.url} label={item.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
