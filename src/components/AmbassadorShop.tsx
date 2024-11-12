// "use client" は、このコンポーネントがクライアントサイドで実行されることを示します。
"use client";

// 必要なモジュールやコンポーネントをインポートします。
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventryCard } from "@/components/InventryCard";

// お菓子のデータ型を定義します。
type Chocolate = {
  product_id: number; // お菓子のID
  product_name: string; // お菓子の名前
  product_image_url: string; // お菓子の画像URL
  stock_quantity: number; // お菓子の在庫数
};

// カート内のアイテムのデータ型を定義します。
type CartItem = {
  product_id: number; // お菓子のID
  quantity: number; // カートに入っている数量
};

// メインのコンポーネントを定義します。
export default function ChocolateShop() {
  // お菓子データを保持するためのステート
  const [chocolates, setChocolate] = useState<Chocolate[]>([]);
  // カートに入っている商品情報を管理するステート
  const [cart, setCart] = useState<CartItem[]>([]);
  // お気に入りのお菓子のIDリストを管理するステート
  const [favorites, setFavorites] = useState<number[]>([]);
  // エラーメッセージを表示するためのステート
  const [error, setError] = useState<string | null>(null);
  // 組織IDを入力するためのステート
  const [organizationId, setOrganizationId] = useState<string>("");

  // お菓子データを取得する関数
  const fetchChocolates = async () => {
    // 組織IDが入力されていない場合はエラーメッセージを設定
    if (!organizationId) {
      setError("組織IDが設定されていません。");
      return;
    }

    // ローカルのAPIルートにリクエストを送信するためのURLを作成します。
    const requestUrl = `/api/products/${organizationId}`;

    try {
      // ローカルのAPIルートからデータを取得します。
      const response = await fetch(requestUrl);

      // レスポンスが正常でない場合はエラーをスローします。
      if (!response.ok) {
        throw new Error(
          `お菓子のデータの取得に失敗しました: ${response.status}`
        );
      }

      // レスポンスのJSONデータを取得します。
      const data = await response.json();
      // お菓子データのステートを更新します。
      setChocolate(data);
      // エラーメッセージをクリアします。
      setError(null);
    } catch (error) {
      // エラーが発生した場合はエラーメッセージを設定します。
      console.error("お菓子のデータを取得中にエラーが発生しました:", error);
      setError("データの取得に失敗しました。後でもう一度試してください。");
    }
  };

  // カートに商品を追加する関数
  const addToCart = (id: number, quantity: number) => {
    setCart((prevCart) => {
      // すでにカートにある商品を探します。
      const existingItem = prevCart.find((item) => item.product_id === id);
      if (existingItem) {
        // すでにカートにある商品は数量を追加します。
        return prevCart.map((item) =>
          item.product_id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 新しい商品をカートに追加します。
        return [...prevCart, { product_id: id, quantity }];
      }
    });
  };

  // カートから商品を削除する関数
  const removeFromCart = (id: number) => {
    // 指定されたIDの商品をカートから除外します。
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== id));
  };

  // お気に入りの状態を切り替える関数
  const toggleFavorite = (id: number) => {
    setFavorites(
      (prevFavorites) =>
        prevFavorites.includes(id)
          ? prevFavorites.filter((favId) => favId !== id) // すでにお気に入りなら除外
          : [...prevFavorites, id] // お気に入りに追加
    );
  };

  // コンポーネントの描画内容を返します。
  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="container mx-auto p-4">
        {/* タイトルを表示 */}
        <h1 className="text-3xl font-bold mb-6">Ambassador Shop</h1>

        {/* エラーメッセージがある場合は表示 */}
        {error && <div className="text-red-500">{error}</div>}

        {/* 組織IDを入力するフォーム */}
        <div className="mb-4">
          <label htmlFor="organizationId" className="block font-medium">
            組織ID
          </label>
          <input
            type="text"
            id="organizationId"
            className="w-full p-2 border rounded-md"
            value={organizationId} // 組織IDのステートをバインド
            onChange={(e) => setOrganizationId(e.target.value)} // 入力値をステートに反映
          />
        </div>

        {/* 組織IDを反映してお菓子の一覧を表示するボタン */}
        <div className="mb-4">
          <Button onClick={fetchChocolates}>お菓子を表示</Button>
        </div>

        {/* お菓子一覧をグリッドレイアウトで表示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chocolates.map((chocolate) => (
            <InventryCard
              key={chocolate.product_id}
              name={chocolate.product_name}
              imageSrc={chocolate.product_image_url}
              isFavorite={favorites.includes(chocolate.product_id)}
              onToggleFavorite={() => toggleFavorite(chocolate.product_id)}
              onAddToCart={(quantity) =>
                addToCart(chocolate.product_id, quantity)
              }
            />
          ))}
        </div>

        {/* カートの内容を表示 */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <ShoppingCart className="mr-2" />
            カート
          </h2>
          {/* カート内の商品リストを表示 */}
          {cart.map((item) => {
            // カート内の商品の詳細情報を取得します。
            const chocolate = chocolates.find(
              (c) => c.product_id === item.product_id
            );
            return chocolate ? (
              <div
                key={item.product_id}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {chocolate.product_name} x {item.quantity}
                </span>
                <Button
                  variant="destructive"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  削除
                </Button>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
