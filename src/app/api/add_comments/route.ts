import { NextResponse } from "next/server";

// POSTリクエストを処理する関数
export async function POST(request: Request) {
  try {
    // リクエストボディを取得しJSONとしてパース
    const body = await request.json();

    const { message_id, from, user_name, message } = body;

    // 必須フィールドのバリデーション
    if (!message_id || !from || !message || !user_name) {
      console.error("必須フィールドが不足しています。", {
        message_id,
        from,
        user_name,
        message,
      });
      return NextResponse.json(
        { error: "すべての必須フィールドを入力してください。" },
        { status: 400 }
      );
    }

    if (isNaN(message_id) || isNaN(from)) {
      console.error("送信データの形式が正しくありません。", {
        message_id,
        from,
      });
      return NextResponse.json(
        { error: "送信データの形式が正しくありません。" },
        { status: 400 }
      );
    }

    // 外部API用のリクエストデータ
    const requestData = {
      message_id: parseInt(message_id, 10),
      comment_user_id: parseInt(from, 10),
      comment_user_name_manual_input: user_name,
      message_content: message,
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
    const response = await fetch(`${apiUrl}/add_comments`, {
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
