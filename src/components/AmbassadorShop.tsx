"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventryCard } from "@/components/InventryCard";

// お菓子のデータ型定義
type Chocolate = {
  product_id: number; // お菓子のID
  product_name: string; // お菓子の名前
  product_image_url: string; // お菓子の画像URL
  stock_quantity: number; // お菓子の在庫数
};

// カートアイテムの型定義
type CartItem = {
  product_id: number; // お菓子のID
  quantity: number; // カートに入っている数量
};

// 環境変数からAPIのURLを取得します
// ここで取得できるURLが正しく設定されているかが非常に重要です
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ChocolateShop() {
  // お菓子データを保持するためのstate
  const [chocolates, setChocolate] = useState<Chocolate[]>([]);
  // カートに入っている商品情報を管理するstate
  const [cart, setCart] = useState<CartItem[]>([]);
  // お気に入りのお菓子のIDリストを管理するstate
  const [favorites, setFavorites] = useState<number[]>([]);
  // エラーメッセージを表示するためのstate
  const [error, setError] = useState<string | null>(null);

  // 組織IDを入力するためのstate
  const [organizationId, setOrganizationId] = useState<string>("");

  // コンポーネントの初回表示時にお菓子データをAPIから取得します
  const fetchChocolates = async () => {
    if (!apiUrl) {
      console.error(
        "API URLが設定されていません。環境変数 NEXT_PUBLIC_API_URL を確認してください。"
      );
      setError("API URLが設定されていません。");
      return;
    }
    // APIからお菓子のデータを取得するリクエストURL (組織IDを含む)
    const requestUrl = `${apiUrl}/products/${organizationId}`;

    try {
      const response = await fetch(requestUrl);
      if (!response.ok) {
        throw new Error(
          `お菓子のデータの取得に失敗しました: ${response.status}`
        );
      }

      const data = await response.json();
      setChocolate(data);
      setError(null);
    } catch (error) {
      console.error("お菓子のデータを取得中にエラーが発生しました:", error);
      setError("データの取得に失敗しました。後でもう一度試してください。");
    }
  };

  // カートに商品を追加する関数
  const addToCart = (id: number, quantity: number) => {
    setCart((prevCart) => {
      // すでにカートにある商品を探します
      const existingItem = prevCart.find((item) => item.product_id === id);
      if (existingItem) {
        // すでにカートにある商品は数量を追加
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
    // 指定されたIDの商品をカートから除外します
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Ambassador Shop</h1>
      {/* エラーがある場合は表示 */}
      {error && <div className="text-red-500">{error}</div>}

      {/* 組織IDを入力する */}
      <div className="mb-4">
        <label htmlFor="organizationId" className="block font-medium">
          組織ID
        </label>
        <input
          type="text"
          id="organizationId"
          className="w-full p-2 border rounded-md"
          value={organizationId} // 組織IDのstateをバインド
          onChange={(e) => setOrganizationId(e.target.value)} // 入力値をstateに反映
        />
      </div>
      {/* 組織IDを反映してお菓子の一覧を表示するボタン */}
      <div className="mb-4">
        <Button onClick={fetchChocolates}>お菓子を表示</Button>
      </div>

      {/* お菓子一覧の表示 */}
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

      {/* カートの表示 */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <ShoppingCart className="mr-2" />
          カート
        </h2>
        {/* カート内の商品リスト */}
        {cart.map((item) => {
          // カート内のIDと一致するお菓子の情報を取得
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
  );
}
