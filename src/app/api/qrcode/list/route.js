export async function GET() {
  // QRコード一覧データを返す
  const qrData = [
    {
      organizationId: "1",
      label: "Office Suzuyu",
      qrCodeSrc: "/api/qrcode?url=1",
    },
    {
      organizationId: "2",
      label: "Office Ryosan",
      qrCodeSrc: "/api/qrcode?url=2",
    },
  ];

  return new Response(JSON.stringify(qrData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
