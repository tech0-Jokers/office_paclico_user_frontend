import QRCode from "qrcode"; // QRコード生成ライブラリ

// サーバーサイドでQRコードを生成するAPIエンドポイント
export async function GET(request) {
  const { searchParams } = new URL(request.url); // リクエストURLからクエリパラメータを取得
  const url = searchParams.get("url"); // "url" パラメータを取得

  if (!url) {
    return new Response(JSON.stringify({ error: "URLが必要です" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // QRコードのデータURLを生成
    const qrCodeDataUrl = await QRCode.toDataURL(url);
    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, ""); // Base64データを抽出

    return new Response(Buffer.from(base64Data, "base64"), {
      status: 200,
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("QRコード生成中にエラー:", error); // エラーをログ出力
    return new Response(
      JSON.stringify({ error: "QRコード生成に失敗しました" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
