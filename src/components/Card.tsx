"use client"; // shadcnのデザインとイベントを動的に動作させる

import React from "react";
import { Button } from "@/components/ui/button"; // shadcn-uiのButtonコンポーネント
import { useRouter } from "next/navigation"; // next/navigationをインポート（appディレクトリ用）

// カードのプロパティ型
interface CardProps {
  onClick: () => void; // ボタンがクリックされたときの処理
}

// カードコンポーネント
const Card: React.FC<CardProps> = ({ onClick }) => {
  const router = useRouter(); // useRouterフックを使用

  const handleMessageAppClick = () => {
    router.push("/message_app"); // /message_appに遷移
    onClick(); // 既存のonClick処理も実行
  };

  const handleAmbassadorShopClick = () => {
    router.push("/ambassador_shop_app"); // /AmbassadorShopに遷移
    onClick(); // 既存のonClick処理も実行
  };

  return (
    <div className="border rounded-lg p-4 shadow-md text-center bg-white">
      {/* カードのタイトル部分 */}
      <h2 className="text-lg font-semibold mb-4">アプリ選択</h2>

      {/* ボタン部分 */}
      <div className="flex flex-col space-y-4">
        {/* Message App ボタン */}
        <Button
          className="bg-purple-600 text-white"
          onClick={handleMessageAppClick} // handleMessageAppClickを使用
          aria-label="Message Appページに移動" // アクセシビリティ対応
        >
          メッセージを贈る
        </Button>

        {/* Ambassador Shop ボタン */}
        <Button
          className="bg-blue-600 text-white"
          onClick={handleAmbassadorShopClick} // handleAmbassadorShopClickを使用
          aria-label="Ambassador Shopページに移動" // アクセシビリティ対応
        >
          お菓子を購入する
        </Button>
      </div>
    </div>
  );
};

export { Card }; // 名前付きエクスポート
