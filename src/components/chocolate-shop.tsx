"use client";

import { useState, useEffect, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-chocolate-card";

// お菓子のデータ型定義
type Chocolate = {
  Index: number; // お菓子のID
  Product_Name: string; // お菓子の名前
  Image_Url: string; // お菓子の画像URL
  Price: number; // お菓子の価格
};

// カートアイテムの型定義
type CartItem = {
  id: number; // お菓子のID
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

  // コンポーネントの初回表示時にお菓子データをAPIから取得します
  useEffect(() => {
    const fetchChocolates = async () => {
      // まず、apiUrlが正しく設定されているか確認します
      if (!apiUrl) {
        console.error(
          "API URLが設定されていません。環境変数 NEXT_PUBLIC_API_URL を確認してください。"
        );
        setError("API URLが設定されていません。");
        return; // URLが無ければ処理を中止
      }

      // 実際にリクエストを送るURLを組み立てます
      const requestUrl = `${apiUrl}/chocolates`;

      try {
        // APIにリクエストを送信して、お菓子データを取得
        const response = await fetch(requestUrl);
        // レスポンスが正常でなければエラーをスローします
        if (!response.ok) {
          throw new Error(
            `お菓子のデータの取得に失敗しました: ${response.status}`
          );
        }

        // JSONデータを解析して、stateに保存
        const data = await response.json();
        setChocolate(data); // データを更新
        setError(null); // エラーが無ければエラーメッセージをリセット
      } catch (error) {
        // エラーメッセージを表示
        console.error("お菓子のデータを取得中にエラーが発生しました:", error);
        setError("データの取得に失敗しました。後でもう一度試してください。");
      }
    };

    // 関数を実行して、お菓子データを取得
    fetchChocolates();
  }, []); // 初回レンダリング時のみ実行

  // カートに商品を追加する関数
  const addToCart = (id: number, quantity: number) => {
    setCart((prevCart) => {
      // すでにカートにある商品を探します
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem) {
        // すでにカートにある商品は数量を追加
        return prevCart.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 新しい商品をカートに追加
        return [...prevCart, { id, quantity }];
      }
    });
  };

  // カートから商品を削除する関数
  const removeFromCart = (id: number) => {
    // 指定されたIDの商品をカートから除外します
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // カート内の合計金額を計算する関数
  // 計算結果は再計算されないようにメモ化（useMemo）しています
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      // カート内のIDと一致するお菓子の情報を取得
      const chocolate = chocolates.find((c) => c.Index === item.id);
      // 商品の価格×数量を合計に追加
      return total + (chocolate ? chocolate.Price * item.quantity : 0);
    }, 0);
  }, [cart, chocolates]); // cartやchocolatesが更新されるたびに再計算

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
      <h1 className="text-3xl font-bold mb-6">チョコレートショップ</h1>
      {/* エラーがある場合は表示 */}
      {error && <div className="text-red-500">{error}</div>}

      {/* お菓子一覧の表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chocolates.map((chocolate) => (
          <ProductCard
            key={chocolate.Index}
            name={chocolate.Product_Name}
            imageSrc={chocolate.Image_Url}
            isFavorite={favorites.includes(chocolate.Index)}
            onToggleFavorite={() => toggleFavorite(chocolate.Index)}
            onAddToCart={(quantity) => addToCart(chocolate.Index, quantity)}
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
          const chocolate = chocolates.find((c) => c.Index === item.id);
          return chocolate ? (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {chocolate.Product_Name} x {item.quantity}
              </span>
              <span>¥{chocolate.Price * item.quantity}</span>
              <Button
                variant="destructive"
                onClick={() => removeFromCart(item.id)}
              >
                削除
              </Button>
            </div>
          ) : null;
        })}
        {/* 合計金額の表示 */}
        <div className="text-xl font-bold mt-4">合計: ¥{totalPrice}</div>
      </div>
    </div>
  );
}
