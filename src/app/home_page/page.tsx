"use client"; // このコンポーネントはクライアントサイドで動作します

//import { useSelectedOrg } from "@/context/SelectedOrgContext"; // コンテキストから状態を取得
import { useState, useEffect } from "react";

import { useOrganization } from "@/context/OrganizationContext";
import { useQueryParams } from "@/context/useQueryParams";

import { Card } from "@/components/Card"; // カードを表示するコンポーネント

export default function HomePage() {
  //  const { selectedOrgId, setSelectedOrgId } = useSelectedOrg(); // コンテキストから状態を取得
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const { setOrganizationId } = useOrganization();

  // クエリパラメータからorganization_idを取得
  useQueryParams(setOrganizationId);

  useEffect(() => {
    const fetchQrData = async () => {
      try {
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

  // カード選択画面を表示
  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">OfficePaclico</h1>
      <div className="min-h-screen bg-purple-100 p-8">
        <h2 className="text-2xl font-bold mb-4">
          あなたが所属するオフィスを選んでください
        </h2>
        <Card
          onClick={() => {
            /* 適切な処理を追加 */
          }}
        />
      </div>
    </div>
  );
}
