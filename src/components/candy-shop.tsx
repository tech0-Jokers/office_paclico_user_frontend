"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";

// お菓子のデータ型
type Candy = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

// 環境変数からAPIのURLを取得します。
// ここで取得できるURLが正しく設定されているかが非常に重要です。
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log("環境変数 NEXT_PUBLIC_API_URL:", apiUrl); // デバッグ用にURLを確認

export default function CandyShop() {
  const [candies, setCandies] = useState<Candy[]>([]); // お菓子データを保持
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]); // カートに入っている商品情報
  const [favorites, setFavorites] = useState<number[]>([]); // お気に入りのお菓子のIDリスト

  useEffect(() => {
    // お菓子のデータをAPIから取得する関数
    const fetchCandies = async () => {
      // まず、apiUrlが正しく設定されているか確認します。
      if (!apiUrl) {
        console.error(
          "API URLが設定されていません。環境変数 NEXT_PUBLIC_API_URL を確認してください。"
        );
        return; // URLが無ければ処理を中止
      }

      // 実際にリクエストを送るURLを組み立てます
      const requestUrl = `${apiUrl}/candies`;
      console.log("お菓子のデータを取得するURL:", requestUrl);

      try {
        // APIにリクエストを送信して、お菓子のデータを取得
        const response = await fetch(requestUrl);
        // レスポンスが正常でなければエラーをスローします
        if (!response.ok) {
          throw new Error(
            `お菓子のデータの取得に失敗しました: ${response.status}`
          );
        }
        // JSONデータを解析して、状態に保存
        const data = await response.json();
        setCandies(data);
      } catch (error) {
        // エラーメッセージを表示
        console.error("お菓子のデータを取得中にエラーが発生しました:", error);
      }
    };

    // 関数を実行
    fetchCandies();
  }, [apiUrl]); // apiUrlが変わった時に再実行

  // カートに商品を追加する関数
  const addToCart = (id: number, quantity: number) => {
    setCart((prevCart) => {
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
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // カート内の商品の合計金額を計算する関数
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const candy = candies.find((c) => c.id === item.id);
      return total + (candy ? candy.price * item.quantity : 0);
    }, 0);
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

  // JSXのレンダリング部分
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">お菓子ショップ</h1>
      {/* お菓子一覧の表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candies.map((candy) => (
          <ProductCard
            key={candy.id}
            name={candy.name}
            description={candy.description}
            price={candy.price}
            imageSrc={candy.image}
            isFavorite={favorites.includes(candy.id)}
            onToggleFavorite={() => toggleFavorite(candy.id)}
            onAddToCart={(quantity) => addToCart(candy.id, quantity)}
          />
        ))}
      </div>
      {/* カートの表示 */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <ShoppingCart className="mr-2" />
          カート
        </h2>
        {cart.map((item) => {
          const candy = candies.find((c) => c.id === item.id);
          return candy ? (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {candy.name} x {item.quantity}
              </span>
              <span>¥{candy.price * item.quantity}</span>
              <Button
                variant="destructive"
                onClick={() => removeFromCart(item.id)}
              >
                削除
              </Button>
            </div>
          ) : null;
        })}
        <div className="text-xl font-bold mt-4">合計: ¥{getTotalPrice()}</div>
      </div>
    </div>
  );
}
