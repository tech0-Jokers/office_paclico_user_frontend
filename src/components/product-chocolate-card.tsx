"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProductCardProps {
  name: string;
  imageSrc: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: (quantity: number) => void;
}

export function ProductCard({
  name,
  imageSrc,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: ProductCardProps) {
  const [showNotification, setShowNotification] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);

  const handleToggleFavorite = () => {
    onToggleFavorite();
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
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
