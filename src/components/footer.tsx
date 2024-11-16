"use client";

import { Button } from "@/components/ui/button";
import {
  MessageCircleHeart,
  Pickaxe,
  ShoppingBasket,
  House,
} from "lucide-react";
import { useSelectedOrg } from "@/context/SelectedOrgContext"; // 状態管理のコンテキストをインポート

console.log("useSelectedOrg:", useSelectedOrg); // デバッグ用ログ

type IconButtonProps = {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
};

function IconButton({ icon: Icon, label, onClick }: IconButtonProps) {
  return (
    <Button
      variant="ghost"
      className="flex flex-col items-center space-y-1 w-full text-muted-foreground p-2"
      style={{ width: "60px", height: "60px" }}
      onClick={onClick}
    >
      <Icon style={{ width: "32px", height: "32px" }} />
      <span className="text-xs">{label}</span>
    </Button>
  );
}

export default function Footer() {
  const { setSelectedOrgId } = useSelectedOrg(); // 状態リセット用の関数を取得

  return (
    <div className="fixed bottom-0 w-full z-50 bg-background p-1">
      <div className="flex justify-around">
        {/* ホームボタン */}
        <IconButton
          icon={House}
          label="ホーム"
          onClick={() => setSelectedOrgId(null)} // 状態をリセット
        />
        <IconButton
          icon={MessageCircleHeart}
          label="Message"
          onClick={() => console.log("Message clicked")}
        />
        <IconButton
          icon={ShoppingBasket}
          label="お菓子の購入"
          onClick={() => console.log("Shop clicked")}
        />
        <IconButton
          icon={Pickaxe}
          label="開発中"
          onClick={() => console.log("Development clicked")}
        />
      </div>
    </div>
  );
}
