// app/api/products/[organizationId]/route.js

// Next.jsのサーバーサイドレスポンスを扱うためのモジュールをインポートします。
import { NextResponse } from "next/server";

// GETリクエストを処理する関数をエクスポートします。
// `request`はリクエストオブジェクト、`params`はURLパラメータを含みます。
// requestのbodyを取得するには、`await request.json()`を使用します。

export async function PUT(request) {
  // URLパラメータから組織IDを取得します。
  // requestのbodyを取得するには、`await request.json()`を使用します。

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
  const requestUrl = `${apiUrl}/inventory_products/purchase/`;

  try {
    // 外部APIに対してデータ取得のリクエストを送信します。
    const response = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await request.json()),
    });

    // レスポンスをJSON形式で返します。
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // エラーレスポンスを返します。
    return NextResponse.json(
      { error: "外部APIへのリクエストに失敗しました。" },
      { status: 500 }
    );
  }
}
