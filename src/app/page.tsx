"use client"; // このコンポーネントはクライアントサイドで動作します

// 必要なReactのフックやコンポーネントをインポート
import { useState, useEffect } from "react";
import { Card } from "@/components/Card"; // カード画面を表示するコンポーネント
import { useOrganization } from "@/context/OrganizationContext"; // 組織情報を管理するためのContext
import { useQueryParams } from "@/context/useQueryParams"; // URLのクエリパラメータを取得するためのカスタムフック
import { Suspense } from "react"; // サスペンスでローディング画面を簡単に設定
import LoadingScreen from "@/components/LoadingScreen"; // ローディング画面をインポート

// ホームページコンポーネントの定義
export default function HomePage() {
  return (
    // Suspenseを使用して、非同期処理中にローディング画面を表示
    <Suspense fallback={<LoadingScreen stage="読み込み中..." />}>
      <MainComponent />
    </Suspense>
  );
}

// メインのロジックを管理するコンポーネント
function MainComponent() {
  // 状態を管理するためのstate
  const [isLoading, setIsLoading] = useState(true); // 全体のローディング状態
  const [loadingStage, setLoadingStage] = useState("initializing"); // 現在のローディングステージ
  const [showCardScreen, setShowCardScreen] = useState(false); // カード画面を表示するか
  const [organizationName, setOrganizationName] = useState(""); // 組織名を保存
  const [error, setError] = useState<string | null>(null); // エラー内容を保存
  const [qrGenerationToken, setQrGenerationToken] = useState(""); // クエリパラメータから取得したトークンを保存

  // 組織IDを管理するContextからデータを取得
  const { organizationId, setOrganizationId } = useOrganization();

  // クエリパラメータからデータを取得し、stateを更新
  useQueryParams(setOrganizationId, setQrGenerationToken);

  // APIのベースURLを環境変数から取得
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // サーバーからデータを取得する非同期関数
  useEffect(() => {
    const fetchQrData = async () => {
      try {
        // ローディングを開始し、現在のステージを更新
        setIsLoading(true);
        setLoadingStage("クエリパラメータを確認中...");

        // 必要なクエリパラメータが不足している場合はエラーをスロー
        if (!organizationId || !qrGenerationToken) {
          throw new Error("クエリパラメータが不足しています");
        }

        // ステージを「トークンを検証中」に変更
        setLoadingStage("トークンを検証中...");

        // APIエンドポイントにPOSTリクエストを送信
        const response = await fetch(`${apiUrl}/validate-token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }, // リクエスト形式をJSONに設定
          body: JSON.stringify({
            organization_id: Number(organizationId), // 組織IDを数値に変換して送信
            qr_generation_token: String(qrGenerationToken), // トークンを文字列に変換して送信
          }),
        });

        // レスポンスがエラーの場合の処理
        if (!response.ok) {
          throw new Error("トークン検証に失敗しました");
        }

        // レスポンスをJSON形式で解析
        const data = await response.json();

        // トークンが有効であればカード画面を表示
        if (data.status === "valid") {
          setShowCardScreen(true); // カード画面を表示
          setOrganizationName(data.organization_name || "不明な組織"); // 組織名を設定
          setLoadingStage("ロード完了"); // ロード完了ステージに変更
        } else {
          throw new Error("無効なトークンです"); // 無効なトークンの場合
        }
      } catch (err) {
        setError((err as Error).message); // エラーメッセージを保存
        setShowCardScreen(false); // カード画面を非表示
        setLoadingStage("エラー発生"); // ステージをエラーに設定
      } finally {
        setIsLoading(false); // ローディングを終了
      }
    };

    // クエリパラメータが揃っている場合のみデータ取得処理を実行
    if (organizationId && qrGenerationToken) {
      fetchQrData();
    } else {
      // クエリパラメータが不足している場合
      setIsLoading(false);
      setLoadingStage("クエリパラメータ不足");
    }
  }, [organizationId, qrGenerationToken, apiUrl]); // 依存関係を指定

  // ローディング中の画面を表示
  if (isLoading) {
    return <LoadingScreen stage={loadingStage} />;
  }

  // エラー発生時の画面を表示
  if (error) {
    return <div className="text-center text-red-600">エラー: {error}</div>;
  }

  // メイン画面をレンダリング
  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">OfficePaclico</h1>
      {showCardScreen ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            あなたが所属する組織: {organizationName}
          </h2>
          <Card onClick={() => {}} />
        </div>
      ) : (
        <p>有効な組織情報が見つかりませんでした。</p>
      )}
    </div>
  );
}
