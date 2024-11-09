"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image"; // Imageコンポーネントをインポート

interface InventryCardProps {
  name: string;
  imageSrc: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: (quantity: number) => void;
}

export function InventryCard({
  name,
  imageSrc,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: InventryCardProps) {
  const [showNotification, setShowNotification] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [imageError, setImageError] = React.useState(false);

  const handleToggleFavorite = () => {
    onToggleFavorite();
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // 画像のエラーハンドリング
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="relative w-full h-48">
          {!imageError && imageSrc ? (
            <Image
              src={imageSrc}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-lg"
              onError={handleImageError}
              unoptimized // 外部画像の場合に必要
            />
          ) : (
            // フォールバック画像やプレースホルダー
            <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
              <span className="text-gray-400">画像を読み込めません</span>
            </div>
          )}
        </div>
        <CardTitle>{name}</CardTitle>
      </CardHeader>

      <CardFooter className="flex flex-col items-start">
        <div className="flex justify-between w-full mb-2">
          <div className="flex items-center">
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-16 mr-2"
            />
            <Button onClick={() => onAddToCart(quantity)}>カートに追加</Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
          >
            <Star
              className={`h-4 w-4 ${isFavorite ? "fill-yellow-400" : ""}`}
            />
          </Button>
        </div>
        {showNotification && (
          <div
            className="text-sm text-green-600 mt-2 transition-opacity duration-300 ease-in-out"
            role="status"
            aria-live="polite"
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
