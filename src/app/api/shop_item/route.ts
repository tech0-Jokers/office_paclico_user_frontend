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
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get("organizationId") || "1"; // デフォルト値を設定

  try {
    const response = await fetch(`${apiUrl}/products/${organizationId}`);

    if (!response.ok) {
      throw new Error(`お菓子のデータの取得に失敗しました: ${response.status}`);
    }

    const data: Chocolate[] = await response.json(); // 取得したデータをChocolate型の配列として指定

    return NextResponse.json({ chocolates: data }, { status: 200 });
  } catch (error) {
    console.error("お菓子のデータを取得中にエラーが発生しました:", error);

    // errorの型をErrorにキャストしてmessageを取得
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
