"use client"; // このコンポーネントはクライアントサイドで動作します

import { useState, useEffect } from "react";
import { Card } from "@/components/Card"; // カードコンポーネントをインポート
import { useOrganization } from "@/context/OrganizationContext"; // 組織情報を管理するContext
import { useQueryParams } from "@/context/useQueryParams"; // クエリパラメータを取得するカスタムフック
import { Suspense } from "react"; // Suspenseをインポート

// ホームページのメインコンポーネント
export default function HomePage() {
  return (
    // Suspenseでメインコンポーネントをラップ
    <Suspense fallback={<div>Loading...</div>}>
      <MainComponent />
    </Suspense>
  );
}

// メインコンポーネント
function MainComponent() {
  // ローディング状態を管理するstate
  const [isLoading, setIsLoading] = useState(true);

  // カード画面を表示するかどうかを管理するstate
  const [showCardScreen, setShowCardScreen] = useState(false);

  // 組織名を管理するstate
  const [organizationName, setOrganizationName] = useState("");

  // エラー情報を格納するstate
  const [error, setError] = useState<string | null>(null);

  // QRコードのトークンを管理するstate
  const [qrGenerationToken, setQrGenerationToken] = useState("");

  // ContextからorganizationIdとそのsetterを取得
  const { organizationId, setOrganizationId } = useOrganization();

  // クエリパラメータからorganization_idとqr_generation_tokenを取得し、それぞれのstateに設定
  useQueryParams(setOrganizationId, setQrGenerationToken);

  // 環境変数からAPIのベースURLを取得
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // 組織情報をサーバーから取得する非同期関数
  useEffect(() => {
    const fetchQrData = async () => {
      // ローディング状態を開始
      setIsLoading(true);

      try {
        // 必要なクエリパラメータが揃っていない場合は処理を中断
        if (!organizationId || !qrGenerationToken) {
          console.log("クエリパラメータが不足しています");
          throw new Error("必要なクエリパラメータが指定されていません");
        }

        // サーバーにPOSTリクエストを送信
        const response = await fetch(`${apiUrl}/validate-token`, {
          method: "POST", // HTTPメソッドをPOSTに設定
          headers: {
            "Content-Type": "application/json", // リクエストのデータ形式をJSONに指定
          },
          body: JSON.stringify({
            organization_id: Number(organizationId), // 数値型に変換して送信
            qr_generation_token: String(qrGenerationToken), // 文字列型に変換して送信
          }),
        });

        // サーバーからエラーレスポンスが返された場合の処理
        if (!response.ok) {
          const errorDetails = await response.json(); // エラーメッセージを取得
          console.error("サーバーエラー:", errorDetails); // エラー内容をコンソールに出力
          throw new Error("ネットワークエラーが発生しました");
        }

        // レスポンスをJSON形式で解析
        const data = await response.json();

        // サーバーからのレスポンスが有効な場合の処理
        if (data.status === "valid") {
          setShowCardScreen(true); // カード画面を表示
          setOrganizationName(data.organization_name || "不明な組織"); // 組織名をstateに保存
        } else {
          setShowCardScreen(false); // 無効な場合はカード画面を非表示
        }
      } catch (err) {
        // エラーが発生した場合の処理
        setError((err as Error).message); // エラーメッセージをstateに保存
        setShowCardScreen(false); // カード画面を非表示
      } finally {
        // ローディング状態を終了
        setIsLoading(false);
      }
    };

    // 必要なクエリパラメータが揃っている場合のみ非同期関数を実行
    if (organizationId && qrGenerationToken) {
      console.log("fetchQrData を実行中...");
      fetchQrData();
    }
  }, [organizationId, qrGenerationToken, apiUrl]); // 依存配列にapiUrlを追加

  // ローディング中の画面
  if (isLoading) return <div>Loading...</div>;

  // エラーが発生した場合の画面
  if (error) return <div>Error: {error}</div>;

  // メイン画面のレンダリング
  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">OfficePaclico</h1>

      {/* カード画面を表示する場合 */}
      {showCardScreen ? (
        <div className="min-h-screen bg-purple-100 p-8">
          <h2 className="text-2xl font-bold mb-4">
            あなたが所属する組織: {organizationName}
          </h2>
          <Card onClick={() => {}} />
        </div>
      ) : (
        // カード画面が無効な場合のメッセージ
        <div>
          <p>有効な組織情報が見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
}
