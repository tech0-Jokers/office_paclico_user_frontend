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

export default function CandyShop() {
  const [candies, setCandies] = useState<Candy[]>([]);
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCandies = async () => {
      try {
        const response = await fetch(`${apiUrl}/candies`);
        if (!response.ok) {
          throw new Error(`Failed to fetch candies: ${response.status}`);
        }
        const data = await response.json();
        setCandies(data);
      } catch (error) {
        console.error("Error fetching candies:", error);
      }
    };

    fetchCandies();
  }, [apiUrl]);

  const addToCart = (id: number, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { id, quantity }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const candy = candies.find((c) => c.id === item.id);
      return total + (candy ? candy.price * item.quantity : 0);
    }, 0);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">お菓子ショップ</h1>
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
