import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params; // params から id を取得

  // 環境変数からAPI URLを取得
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      { error: "API URLが設定されていません。環境変数を確認してください。" },
      { status: 500 }
    );
  }

  if (!id || Array.isArray(id)) {
    return NextResponse.json({ error: "Invalid message ID" }, { status: 400 });
  }

  // 外部APIにリクエストを送信
  const requestUrl = `${apiUrl}/like_message/${id}`;
  try {
    const response = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // キャッシュを無効化
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `APIリクエスト失敗: ${response.status} ${response.statusText} - ${errorText}`
      );
      return NextResponse.json(
        { error: `API request failed: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("外部APIエラー:", error);
    return NextResponse.json({ error: "外部APIエラー" }, { status: 500 });
  }
}
