// src/app/api/messages/route.ts

import { NextResponse } from "next/server"; // Next.jsのレスポンスオブジェクトをインポート

// メッセージのデータ型を定義
interface Message {
  id: number; // メッセージのID
  to: string; // 受取人
  from: string; // 送信者
  message: string; // メッセージ内容
  treat: string; // お菓子の種類
  likes: number; // いいねの数
  replies: string[]; // 返信のリスト
  imageUrl: string; // お菓子の画像URL
}

// メッセージのサンプルデータを配列で定義
const messages: Message[] = [
  {
    id: 1,
    to: "高橋さん",
    from: "鈴木",
    message: "ありがとうございます！",
    treat: "チョコレート",
    likes: 0,
    replies: [],
    imageUrl:
      "https://www.meiji.co.jp/products/chocolate/assets/img/22639_small.jpg",
  },
  {
    id: 2,
    to: "伊藤さん",
    from: "高橋",
    message: "頑張ってください！",
    treat: "クラッカー",
    likes: 0,
    replies: [],
    imageUrl:
      "https://www.meiji.co.jp/products/chocolate/assets/img/4902777200217_small.jpg",
  },
];

// GETリクエストを処理する関数をエクスポート
export async function GET() {
  return NextResponse.json(messages); // メッセージのリストをJSON形式で返す
}
