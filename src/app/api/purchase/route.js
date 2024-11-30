// app/api/products/[organizationId]/route.js

// Next.jsのサーバーサイドレスポンスを扱うためのモジュールをインポートします。
import { NextResponse } from "next/server";

// GETリクエストを処理する関数をエクスポートします。
// `request`はリクエストオブジェクト、`params`はURLパラメータを含みます。
// requestのbodyを取得するには、`await request.json()`を使用します。

export async function PUT(request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    // リクエストボディを取得
    const requestBody = await request.json(); // 修正ポイント
    console.log("受信したリクエストボディ:", requestBody);

    if (!requestBody.organization_id || !Array.isArray(requestBody.purchases)) {
      console.error("リクエストデータ形式が不正です:", requestBody);
      return NextResponse.json(
        { error: "リクエストデータ形式が不正です。" },
        { status: 400 }
      );
    }

    const response = await fetch(`${apiUrl}/inventory_products/purchase/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-cache",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("外部APIエラー:", errorText);
      return NextResponse.json(
        { error: `外部APIエラー: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("外部APIレスポンス:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("サーバー内部エラー:", error);
    return NextResponse.json(
      { error: "サーバー内部エラーが発生しました。" },
      { status: 500 }
    );
  }
}
