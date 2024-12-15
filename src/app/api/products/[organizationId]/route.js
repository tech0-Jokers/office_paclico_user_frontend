// app/api/products/[organizationId]/route.js

// Next.jsのサーバーサイドレスポンスを扱うためのモジュールをインポートします。
import { NextResponse } from "next/server";

// GETリクエストを処理する関数をエクスポートします。
// `request`はリクエストオブジェクト、`params`はURLパラメータを含みます。
export async function GET(request, { params }) {
  // URLパラメータから組織IDを取得します。
  const { organizationId } = params;

  // 環境変数から外部APIのベースURLを取得します。
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // APIのURLが設定されていない場合はエラーレスポンスを返します。
  if (!apiUrl) {
    return NextResponse.json(
      { error: "API URLが設定されていません。環境変数を確認してください。" },
      { status: 500 }
    );
  }

  // 外部APIにリクエストを送るための完全なURLを作成します。
  const requestUrl = `${apiUrl}/products/${organizationId}`;

  try {
    // 外部APIに対してデータ取得のリクエストを送信します。
    const response = await fetch(requestUrl, {
      cache: "no-store", // キャッシュを無効化
    });

    // レスポンスが正常でない場合はエラーをスローします。
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    // レスポンスのJSONデータを取得します。
    const data = await response.json();

    // 取得したデータをJSON形式でクライアントに返します。
    return NextResponse.json(data);
  } catch (error) {
    // エラーが発生した場合はコンソールにログを出力し、エラーレスポンスを返します。
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました。後でもう一度試してください。" },
      { status: 500 }
    );
  }
}
