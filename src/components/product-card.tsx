"use client"; // クライアントサイドでのレンダリングを指定します

import * as React from "react"; // Reactの機能をインポート
import { Star } from "lucide-react"; // アイコンをインポート
import { Button } from "@/components/ui/button"; // ボタンコンポーネントをインポート
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // カードコンポーネントの各部分をインポート
import { Input } from "@/components/ui/input"; // 入力フィールドをインポート

// プロダクトカードに渡されるプロパティの型を定義します
interface ProductCardProps {
  name: string; // 商品名
  description: string; // 商品説明
  price: number; // 商品価格
  imageSrc: string; // 商品画像のURL
  isFavorite: boolean; // お気に入り状態
  onToggleFavorite: () => void; // お気に入りを切り替える関数
  onAddToCart: (quantity: number) => void; // カートに追加する関数
}

// プロダクトカードコンポーネントを定義します
export function ProductCard({
  name,
  description,
  price,
  imageSrc,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: ProductCardProps) {
  // お知らせ表示状態を管理するためのステート
  const [showNotification, setShowNotification] = React.useState(false);
  // カートに追加する数量を管理するためのステート
  const [quantity, setQuantity] = React.useState(1);

  // お気に入りのトグル処理
  const handleToggleFavorite = () => {
    onToggleFavorite(); // お気に入り状態を切り替える関数を呼び出します
    setShowNotification(true); // 通知を表示するステートを更新
    setTimeout(() => setShowNotification(false), 2000); // 2秒後に通知を非表示にします
  };

  return (
    <Card className="w-full">
      {" "}
      {/* カード全体を包むコンポーネント */}
      <CardHeader>
        {" "}
        {/* カードのヘッダー部分 */}
        <img
          src={imageSrc} // 商品画像
          alt={name} // 画像の説明（アクセシビリティ向上のため）
          className="w-full h-48 object-cover rounded-t-lg" // スタイルの設定
        />
        <CardTitle>{name}</CardTitle> {/* 商品名を表示 */}
        <CardDescription>{description}</CardDescription> {/* 商品説明を表示 */}
      </CardHeader>
      <CardContent>
        {" "}
        {/* カードのコンテンツ部分 */}
        <p className="text-2xl font-bold">¥{price}</p> {/* 価格を表示 */}
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        {" "}
        {/* カードのフッター部分 */}
        <div className="flex justify-between w-full mb-2">
          {" "}
          {/* ボタンと入力フィールドを横並びにするためのラッパー */}
          <div className="flex items-center">
            {" "}
            {/* 入力フィールドとボタンを包む */}
            <Input
              type="number" // 数量入力用
              min={1} // 最小値を1に設定
              value={quantity} // 入力フィールドの値をステートから取得
              onChange={(e) => setQuantity(parseInt(e.target.value))} // 入力変更時に数量を更新
              className="w-16 mr-2" // スタイル設定
            />
            <Button onClick={() => onAddToCart(quantity)}>カートに追加</Button>{" "}
            {/* カートに追加ボタン */}
          </div>
          <Button
            variant="outline" // ボタンのスタイル
            size="icon" // アイコンボタン
            onClick={handleToggleFavorite} // お気に入り切り替え処理
            aria-label={isFavorite ? "お気に入りから削除" : "お気に入りに追加"} // アクセシビリティ用のラベル
          >
            <Star
              className={`h-4 w-4 ${isFavorite ? "fill-yellow-400" : ""}`} // お気に入り状態に応じてスタイルを変更
            />
          </Button>
        </div>
        {/* 通知メッセージを表示 */}
        {showNotification && (
          <div
            className="text-sm text-green-600 mt-2 transition-opacity duration-300 ease-in-out"
            role="status" // アクセシビリティ用の役割
            aria-live="polite" // 通知が発生した際に画面リーダーに伝える
          >
            {isFavorite
              ? "お気に入りに追加しました"
              : "お気に入りから削除しました"}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
