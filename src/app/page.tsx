"use client"; // このコンポーネントはクライアントサイドで動作します

import { useState, useEffect } from "react"; // Reactのstateと副作用を使用
import { Card } from "@/components/Card"; // カードコンポーネントをインポート
import { useOrganization } from "@/context/OrganizationContext"; // 組織情報を管理するContext
import { useQueryParams } from "@/context/useQueryParams"; // クエリパラメータを取得するカスタムフック
import { Suspense } from "react"; // サスペンスで遅延ローディングを管理

export default function HomePage() {
  return (
    // ローディング中に「Loading...」と表示
    <Suspense fallback={<div>Loading...</div>}>
      <MainComponent />
    </Suspense>
  );
}

// メインコンポーネントの定義
function MainComponent() {
  // 各種状態を管理するstateを定義
  const [isLoading, setIsLoading] = useState(true); // 全体のローディング状態
  const [loadingStage, setLoadingStage] = useState("initializing"); // 現在のローディングステージ
  const [showCardScreen, setShowCardScreen] = useState(false); // カード画面を表示するかどうか
  const [organizationName, setOrganizationName] = useState(""); // 組織名を保存するstate
  const [error, setError] = useState<string | null>(null); // エラー情報を格納
  const [qrGenerationToken, setQrGenerationToken] = useState(""); // QRコードトークンを保存

  // 組織IDを管理するContextから取得
  const { organizationId, setOrganizationId } = useOrganization();

  // クエリパラメータから必要な情報を取得
  useQueryParams(setOrganizationId, setQrGenerationToken);

  // APIのベースURLを環境変数から取得
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // 組織情報をサーバーから取得する非同期処理
  useEffect(() => {
    const fetchQrData = async () => {
      try {
        setIsLoading(true); // ローディング状態を開始
        setLoadingStage("checking-query-params"); // クエリパラメータ確認ステージに設定

        // クエリパラメータが不足している場合はエラー
        if (!organizationId || !qrGenerationToken) {
          console.log("クエリパラメータが不足しています");
          throw new Error("クエリパラメータが不足しています");
        }

        // トークン検証ステージに進む
        setLoadingStage("validating-token");

        // サーバーにPOSTリクエストを送信
        const response = await fetch(`${apiUrl}/validate-token/`, {
          method: "POST", // POSTメソッドを指定
          headers: {
            "Content-Type": "application/json", // リクエスト形式をJSONに設定
          },
          body: JSON.stringify({
            organization_id: Number(organizationId), // 組織IDを数値に変換して送信
            qr_generation_token: String(qrGenerationToken), // トークンを文字列に変換して送信
          }),
        });

        // サーバーがエラーレスポンスを返した場合の処理
        if (!response.ok) {
          const errorDetails = await response.json(); // サーバーからのエラー内容を取得
          console.error("サーバーエラー:", errorDetails); // エラーをコンソールに出力
          throw new Error("トークン検証に失敗しました");
        }

        // サーバーからのレスポンスを解析
        const data = await response.json();

        // トークンが有効な場合の処理
        if (data.status === "valid") {
          setShowCardScreen(true); // カード画面を表示
          setOrganizationName(data.organization_name || "不明な組織"); // 組織名を設定
          setLoadingStage("finished"); // ローディング完了ステージに設定
        } else {
          setShowCardScreen(false); // 無効なトークンの場合はカード画面を非表示
          throw new Error("無効なトークンです");
        }
      } catch (err) {
        setError((err as Error).message); // エラーをstateに保存
        setShowCardScreen(false); // エラー時はカード画面を非表示
        setLoadingStage("error"); // エラーステージに設定
      } finally {
        setIsLoading(false); // ローディング状態を終了
      }
    };

    // 必要なクエリパラメータが揃っている場合のみリクエストを実行
    if (organizationId && qrGenerationToken) {
      console.log("fetchQrData を実行中...");
      fetchQrData();
    } else {
      setIsLoading(false); // クエリパラメータ不足時にローディング終了
      setLoadingStage("query-params-missing"); // クエリパラメータ不足ステージに設定
    }
  }, [organizationId, qrGenerationToken, apiUrl]); // 依存関係を指定

  // ローディング中の画面
  if (isLoading) {
    switch (loadingStage) {
      case "initializing":
        return <div>アプリケーションを初期化中...</div>;
      case "checking-query-params":
        return <div>クエリパラメータを確認中...</div>;
      case "validating-token":
        return <div>トークンを検証中...</div>;
      default:
        return <div>Loading...</div>;
    }
  }

  // クエリパラメータが不足している場合の画面
  if (loadingStage === "query-params-missing") {
    return <div>クエリパラメータが不足しています。</div>;
  }

  // エラー発生時の画面
  if (error) {
    return <div>Error: {error}</div>;
  }

  // メイン画面をレンダリング
  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">OfficePaclico</h1>
      {showCardScreen ? (
        <div className="min-h-screen bg-purple-100 p-8">
          <h2 className="text-2xl font-bold mb-4">
            あなたが所属する組織: {organizationName}
          </h2>
          <Card onClick={() => {}} />
        </div>
      ) : (
        <div>
          <p>有効な組織情報が見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
}
