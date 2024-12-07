"use client"; // このコンポーネントはクライアントサイドで動作します

import { useSelectedOrg } from "@/context/SelectedOrgContext"; // コンテキストから状態を取得
import { useState, useEffect } from "react";
import QRCodeList from "@/components/QRCodeList"; // QRコード一覧を表示するコンポーネント
import AmbassadorShop from "@/components/AmbassadorShop"; // ショップ画面のコンポーネント

import { useOrganization } from "@/context/OrganizationContext";
import { useQueryParams } from "@/context/useQueryParams";

export default function HomePage() {
  const { selectedOrgId, setSelectedOrgId } = useSelectedOrg(); // コンテキストから状態を取得
  const [qrData, setQrData] = useState([]); // QRコードデータを保持するステート
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const { organizationId, setOrganizationId } = useOrganization();

  // クエリパラメータからorganization_idを取得
  useQueryParams(setOrganizationId);

  useEffect(() => {
    const fetchQrData = async () => {
      try {
        // サーバーからQRコードデータを取得
        const response = await fetch("/api/qrcode/list");
        if (!response.ok) throw new Error("QRデータの取得に失敗しました");
        const data = await response.json();
        setQrData(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("An unknown error occurred");
        }
      } finally {
        setIsLoading(false); // ローディング状態を解除
      }
    };

    fetchQrData(); // データ取得を実行
  }, []); // 初回レンダリング時に実行

  // ローディング中の表示
  if (isLoading) return <div>Loading...</div>;

  // 組織が選択された場合はショップ画面を表示
  if (selectedOrgId) {
    return (
      <div className="min-h-screen bg-purple-100 p-8">
        <AmbassadorShop organizationId={Number(selectedOrgId)} />
      </div>
    );
  }

  // QRコード選択画面を表示
  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">OfficePaclico</h1>
      <div className="min-h-screen bg-purple-100 p-8">
        <div className="max-w-3xl mx-auto">
          {organizationId ? (
            <p className="text-lg text-purple-600">
              Organization ID: {organizationId}
            </p>
          ) : (
            <p className="text-lg text-purple-600">
              Organization ID not found.
            </p>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-4">
          あなたが所属するオフィスを選んでください
        </h2>
        <QRCodeList qrData={qrData} onSelect={setSelectedOrgId} />
      </div>
    </div>
  );
}
