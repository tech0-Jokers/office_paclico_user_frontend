import { NextResponse } from "next/server";

// POSTリクエストを処理する関数
export async function POST(request: Request) {
  try {
    // リクエストボディを取得しJSONとしてパース
    const body = await request.json();

    const { to, to_name, from, from_name, message, treat } = body;

    // 必須フィールドのバリデーション
    if (!to || !to_name || !from || !from_name || !message || !treat) {
      console.error("必須フィールドが不足しています。", {
        to,
        to_name,
        from,
        from_name,
        message,
        treat,
      });
      return NextResponse.json(
        { error: "すべての必須フィールドを入力してください。" },
        { status: 400 }
      );
    }

    if (isNaN(to) || isNaN(from) || isNaN(treat)) {
      console.error("送信データの形式が正しくありません。", {
        to,
        from,
        treat,
      });
      return NextResponse.json(
        { error: "送信データの形式が正しくありません。" },
        { status: 400 }
      );
    }

    // 外部API用のリクエストデータ
    const requestData = {
      message_content: message,
      sender_user_id: parseInt(to, 10),
      sender_user_name_manual_input: to_name,
      receiver_user_id: parseInt(from, 10),
      receiver_user_name_manual_input: from_name,
      product_id: parseInt(treat, 10),
    };

    // 環境変数から外部APIのURLを取得
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URLが設定されていません。");
      return NextResponse.json(
        { error: "サーバー設定エラー。" },
        { status: 500 }
      );
    }

    // 外部APIにリクエストを送信
    const response = await fetch(`${apiUrl}/add_message/`, {
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
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
