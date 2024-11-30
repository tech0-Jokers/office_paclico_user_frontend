import { NextResponse } from "next/server";
import type { Message } from "@/components/types";

const messages: Message[] = [];

export async function GET() {
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // サーバー側で一意のIDを生成
    const newId =
      messages.length > 0
        ? Math.max(...messages.map((m) => m.message_id)) + 1
        : 1;

    // 新しいメッセージを作成
    const newMessage = {
      id: newId, // サーバー側で生成したIDを使用
      ...body,
      likes: 0,
      replies: [],
    };

    messages.push(newMessage); // メッセージリストに追加
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error occurred:", error); // エラーをログ出力
    return NextResponse.json(
      { error: "メッセージの保存に失敗しました" },
      { status: 500 }
    );
  }
}
