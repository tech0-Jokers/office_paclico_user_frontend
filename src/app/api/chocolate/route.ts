// pages/api/chocolates.ts
import { NextResponse } from "next/server"; // Next.jsのレスポンスオブジェクトをインポート

// お菓子のデータ型定義
type Chocolate = {
  Index: number; // お菓子のID
  Product_Name: string; // お菓子の名前
  Image_Url: string; // お菓子の画像URL
  Price: number; // お菓子の価格
};

// 環境変数からAPIのURLを取得します
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// GETリクエストを処理する関数
export async function GET() {
  try {
    const response = await fetch(`${apiUrl}/chocolates`);

    if (!response.ok) {
      throw new Error(`お菓子のデータの取得に失敗しました: ${response.status}`);
    }

    const data: Chocolate[] = await response.json(); // 取得したデータをChocolate型の配列として指定

    return NextResponse.json({ chocolates: data }, { status: 200 });
  } catch (error) {
    console.error("お菓子のデータを取得中にエラーが発生しました:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
