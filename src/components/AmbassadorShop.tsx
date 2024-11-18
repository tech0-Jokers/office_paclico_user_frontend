// "use client" を指定して、このコンポーネントがクライアントサイドで実行されることを明示します。
"use client";

// 必要なモジュールやフックをインポートします。
import { useEffect, useState } from "react"; // Reactのフック
import { ShoppingCart } from "lucide-react"; // アイコン
import { Button } from "@/components/ui/button"; // ボタンコンポーネント
import { InventryCard } from "@/components/InventryCard"; // 商品カードコンポーネント

// お菓子データの型を定義します。
type Chocolate = {
  product_id: number; // お菓子のID
  product_name: string; // お菓子の名前
  product_image_url: string; // お菓子の画像URL
  stock_quantity: number; // 在庫数
};

// カートアイテムの型を定義します。
type CartItem = {
  product_id: number; // 商品のID
  quantity: number; // カートに入れた数量
};

// メインのコンポーネント
export default function AmbassadorShop({
  organizationId,
}: {
  organizationId: number;
}) {
  const [chocolates, setChocolates] = useState<Chocolate[]>([]); // お菓子のデータを保持するステート
  const [cart, setCart] = useState<CartItem[]>([]); // カートに追加された商品を管理するステート
  const [favorites, setFavorites] = useState<number[]>([]); // お気に入りリスト
  const [error, setError] = useState<string | null>(null); // エラーメッセージを保持するステート

  // 初回レンダリング時、またはorganizationIdが変更されたときにデータを取得します。
  useEffect(() => {
    if (organizationId) {
      fetchChocolates(organizationId); // データ取得関数を呼び出す
    }
  }, [organizationId]); // organizationIdが変化するたびに再実行

  // APIからお菓子データを取得する非同期関数
  const fetchChocolates = async (organizationId: number) => {
    const requestUrl = `/api/products/${organizationId}`; // APIのエンドポイントを作成
    try {
      const response = await fetch(requestUrl); // APIリクエストを送信

      // レスポンスがエラーの場合は例外をスロー
      if (!response.ok) {
        throw new Error(`お菓子データの取得に失敗しました: ${response.status}`);
      }

      const data = await response.json(); // レスポンスデータをJSON形式で取得
      setChocolates(data); // 取得したデータをステートにセット
      setError(null); // エラーメッセージをクリア
    } catch (error) {
      console.error("データ取得中にエラー:", error); // コンソールにエラーを表示
      setError("データの取得に失敗しました。後でもう一度試してください。"); // ユーザーにエラーメッセージを表示
    }
  };

  // カートに商品を追加する関数
  const addToCart = (id: number, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product_id === id); // 既存のカートアイテムを検索
      if (existingItem) {
        // 既にカートにある場合は数量を更新
        return prevCart.map((item) =>
          item.product_id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 新しい商品をカートに追加
        return [...prevCart, { product_id: id, quantity }];
      }
    });
  };

  // カートから商品を削除する関数
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== id)); // 指定IDの商品を除外
  };

  // お気に入りリストのオン・オフを切り替える関数
  const toggleFavorite = (id: number) => {
    setFavorites(
      (prevFavorites) =>
        prevFavorites.includes(id)
          ? prevFavorites.filter((favId) => favId !== id) // 既にお気に入りの場合は削除
          : [...prevFavorites, id] // お気に入りに追加
    );
  };

  // UIの描画部分
  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="container mx-auto">
        {/* ページタイトル */}
        <h1 className="text-3xl font-bold mb-6">Ambassador Shop</h1>

        {/* エラーメッセージを表示 */}
        {error && <div className="text-red-500">{error}</div>}

        {/* 商品リストをグリッド形式で表示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chocolates.map((chocolate) => (
            <InventryCard
              key={chocolate.product_id}
              name={chocolate.product_name}
              imageSrc={chocolate.product_image_url}
              isFavorite={favorites.includes(chocolate.product_id)} // お気に入り状態
              onToggleFavorite={() => toggleFavorite(chocolate.product_id)} // お気に入りの切り替え
              onAddToCart={
                (quantity) => addToCart(chocolate.product_id, quantity) // カートに追加
              }
            />
          ))}
        </div>

        {/* カート内容を表示 */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <ShoppingCart className="mr-2" />
            カート
          </h2>

          {/* カートに入っている商品のリスト */}
          {cart.map((item) => {
            const chocolate = chocolates.find(
              (c) => c.product_id === item.product_id
            ); // 商品の詳細情報を取得
            return chocolate ? (
              <div
                key={item.product_id}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {chocolate.product_name} x {item.quantity}
                </span>
                {/* カートから商品を削除するボタン */}
                <Button
                  variant="destructive"
                  onClick={() => removeFromCart(item.product_id)} // カートから削除
                >
                  削除
                </Button>
              </div>
            ) : null;
          })}
        </div>
        {/* カートに入っている商品を購入するボタンで、ボタンを押すとモーダルウィンドウが開く */}
        <Button variant="default">購入</Button>
      </div>
    </div>
  );
}
