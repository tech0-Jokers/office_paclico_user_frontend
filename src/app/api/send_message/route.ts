import { NextResponse } from "next/server";

// POSTリクエストを処理する関数
export async function POST(request: Request) {
  try {
    // リクエストボディを取得しJSONとしてパース
    const body = await request.json();

    const { to, from, message, treat } = body;

    // 必須フィールドのバリデーション
    if (!to || !from || !message || !treat) {
      return NextResponse.json(
        { error: "すべての必須フィールドを入力してください。" },
        { status: 400 }
      );
    }

    if (isNaN(to) || isNaN(from) || isNaN(treat)) {
      return NextResponse.json(
        { error: "送信データの形式が正しくありません。" },
        { status: 400 }
      );
    }

    // 外部API用のリクエストデータ
    const requestData = {
      message_content: message,
      sender_user_id: to,
      receiver_user_id: from,
      product_id: treat,
    };

    // 環境変数から外部APIのURLを取得
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URLが設定されていません。");
      return NextResponse.json(
        { error: "API URLが設定されていません。" },
        { status: 500 }
      );
    }

    // 外部APIにリクエストを送信
    const response = await fetch(`${apiUrl}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // 外部APIのレスポンスを確認
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`APIエラー: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: "外部APIへの送信に失敗しました。" },
        { status: response.status }
      );
    }

    // 正常なレスポンスの場合、クライアントに返却
    const responseData = await response.json();
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("サーバーエラー:", error);
    return NextResponse.json(
      {
        error: `リクエストの処理中にエラーが発生しました: ${
          (error as Error).message
        }`,
      },
      { status: 500 }
    );
  }
}
