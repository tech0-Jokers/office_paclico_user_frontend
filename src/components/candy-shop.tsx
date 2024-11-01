"use client"; // クライアントサイドでのレンダリングを指定します

import { useState, useEffect } from "react"; // Reactのフックをインポート
import { ShoppingCart } from "lucide-react"; // ショッピングカートアイコンをインポート
import { Button } from "@/components/ui/button"; // ボタンコンポーネントをインポート
import { ProductCard } from "@/components/product-card"; // 商品カードコンポーネントをインポート

// お菓子のデータ型を定義します
type Candy = {
  id: number; // お菓子のID
  name: string; // お菓子の名前
  price: number; // お菓子の価格
  image: string; // お菓子の画像URL
  description: string; // お菓子の説明
};

// 環境変数からAPIのURLを取得します
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 環境変数から取得
console.log("環境変数 NEXT_PUBLIC_API_URL:", apiUrl); // デバッグ用にURLを表示

// CandyShopコンポーネントの定義
export default function CandyShop() {
  // お菓子データを保持するためのステート
  const [candies, setCandies] = useState<Candy[]>([]);
  // カートに入っている商品情報を保持するためのステート
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  // お気に入りのお菓子のIDリストを保持するためのステート
  const [favorites, setFavorites] = useState<number[]>([]);

  // コンポーネントがマウントされたときにお菓子データを取得するためのエフェクト
  useEffect(() => {
    // お菓子のデータをAPIから取得する関数
    const fetchCandies = async () => {
      // apiUrlが正しく設定されているか確認します
      if (!apiUrl) {
        console.error(
          "API URLが設定されていません。環境変数 NEXT_PUBLIC_API_URL を確認してください。"
        );
        return; // URLが無ければ処理を中止
      }

      // APIリクエストを送るURLを組み立てます
      const requestUrl = `${apiUrl}/candies`;
      console.log("お菓子のデータを取得するURL:", requestUrl); // リクエストURLを表示

      try {
        // APIにリクエストを送信し、お菓子データを取得
        const response = await fetch(requestUrl);
        // レスポンスが正常でなければエラーをスローします
        if (!response.ok) {
          throw new Error(
            `お菓子のデータの取得に失敗しました: ${response.status}`
          );
        }
        // JSONデータを解析し、ステートに保存
        const data = await response.json();
        setCandies(data); // お菓子データを更新
      } catch (error) {
        // エラーメッセージを表示
        console.error("お菓子のデータを取得中にエラーが発生しました:", error);
      }
    };

    // お菓子データを取得する関数を実行
    fetchCandies();
  }, [apiUrl]); // apiUrlが変更されたときに再実行

  // カートに商品を追加する関数
  const addToCart = (id: number, quantity: number) => {
    setCart((prevCart) => {
      // すでにカートにある商品を探します
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem) {
        // すでにカートにある商品は数量を追加
        return prevCart.map(
          (item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity } // 数量を更新
              : item // 他の商品はそのまま
        );
      } else {
        // 新しい商品をカートに追加
        return [...prevCart, { id, quantity }]; // 新しい商品を追加
      }
    });
  };

  // カートから商品を削除する関数
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id)); // 指定したIDの商品を除外
  };

  // カート内の商品の合計金額を計算する関数
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      // カートの各アイテムに対して処理
      const candy = candies.find((c) => c.id === item.id); // お菓子のデータを取得
      return total + (candy ? candy.price * item.quantity : 0); // 合計金額を計算
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
      {" "}
      {/* コンテナのスタイル */}
      <h1 className="text-3xl font-bold mb-6">お菓子ショップ</h1>{" "}
      {/* ショップタイトル */}
      {/* お菓子一覧の表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {" "}
        {/* レスポンシブなグリッドレイアウト */}
        {candies.map((candy) => (
          <ProductCard
            key={candy.id} // 一意のキーを設定
            name={candy.name} // 商品名を渡す
            description={candy.description} // 商品説明を渡す
            price={candy.price} // 商品価格を渡す
            imageSrc={candy.image} // 商品画像を渡す
            isFavorite={favorites.includes(candy.id)} // お気に入り状態を渡す
            onToggleFavorite={() => toggleFavorite(candy.id)} // お気に入り切り替え処理
            onAddToCart={(quantity) => addToCart(candy.id, quantity)} // カート追加処理
          />
        ))}
      </div>
      {/* カートの表示 */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        {" "}
        {/* カートのスタイル */}
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          {" "}
          {/* カートタイトル */}
          <ShoppingCart className="mr-2" /> {/* カートアイコン */}
          カート
        </h2>
        {cart.map((item) => {
          const candy = candies.find((c) => c.id === item.id); // カート内の商品のデータを取得
          return candy ? (
            <div
              key={item.id} // 一意のキーを設定
              className="flex justify-between items-center mb-2" // スタイル設定
            >
              <span>
                {candy.name} x {item.quantity} {/* 商品名と数量を表示 */}
              </span>
              <span>¥{candy.price * item.quantity}</span> {/* 合計金額を表示 */}
              <Button
                variant="destructive" // 削除ボタンのスタイル
                onClick={() => removeFromCart(item.id)} // 削除処理
              >
                削除
              </Button>
            </div>
          ) : null; // 商品データが見つからなければ何も表示しない
        })}
        <div className="text-xl font-bold mt-4">合計: ¥{getTotalPrice()}</div>{" "}
        {/* カートの合計金額を表示 */}
      </div>
    </div>
  );
}
