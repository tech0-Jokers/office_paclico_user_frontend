// src/app/api/messages/route.ts

import { NextResponse } from "next/server"; // Next.jsのレスポンスオブジェクトをインポート

// GETリクエストを処理する関数をエクスポートします。
// `request`はリクエストオブジェクト、`params`はURLパラメータを含みます。

export async function GET(
  request: Request,
  { params }: { params: { organizationId: string } }
) {
  // URLパラメータから組織IDを取得します。
  const { organizationId } = params;

  // 環境変数から外部APIのベースURLを取得します。
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // APIのURLが設定されていない場合はエラーレスポンスを返します。
  if (!apiUrl) {
    console.error("API URLが設定されていません。環境変数を確認してください。");
    return NextResponse.json(
      { error: "API URLが設定されていません。環境変数を確認してください。" },
      { status: 500 }
    );
  }

  if (!organizationId) {
    console.error("組織IDが指定されていません。");
    return NextResponse.json(
      { error: "組織IDが指定されていません。" },
      { status: 400 }
    );
  }

  // 外部APIにリクエストを送るための完全なURLを作成します。
  const requestUrl = `${apiUrl}/messages/?organization_id=${organizationId}`;
  console.log("Request URL:", requestUrl); // デバッグ用にリクエストURLをログ出力

  try {
    // 外部APIに対してデータ取得のリクエストを送信します。
    const response = await fetch(requestUrl);
    const responseData = await response.text();
    console.log("Response textdata:", responseData); // デバッグ用にレスポンスデータをログ出力

    // レスポンスが正常でない場合はエラーをスローします。
    if (!response.ok) {
      console.error(
        `Failed to fetch data: ${response.status} - ${responseData}`
      );
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    // レスポンスのJSONデータを取得します。
    const data = JSON.parse(responseData); // JSONデータをパース

    // 取得したデータをJSON形式でクライアントに返します。
    return NextResponse.json(data);
  } catch (error) {
    // エラーが発生した場合はコンソールにログを出力し、エラーレスポンスを返します。
    console.error("データ取得エラー:", error);
    return NextResponse.json(
      {
        error: `データの取得に失敗しました。後でもう一度試してください。詳細: ${
          (error as Error).message
        }`,
      },
      { status: 500 }
    );
  }
}
