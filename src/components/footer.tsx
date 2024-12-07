"use client"; // このコンポーネントはクライアントサイドで動作します

import { Button } from "@/components/ui/button"; // ボタンコンポーネントをインポート
import { MessageCircleHeart, Pickaxe, House } from "lucide-react"; // アイコンをインポート
import { useRouter } from "next/navigation"; // Next.jsのルーターを使用
import { useOrganization } from "@/context/OrganizationContext";

// IconButtonコンポーネントのプロパティ型
type IconButtonProps = {
  icon: React.ElementType; // アイコンの型（Reactのコンポーネント型）
  label: string; // ボタンのラベル
  onClick?: (organizationId?: string) => void; // ボタンがクリックされたときの処理
  href?: string; // リンク先のURL（省略可能）
  organizationId?: string; // 渡すorganizationId
};

// アイコン付きボタンコンポーネント
function IconButton({
  icon: Icon,
  label,
  onClick,
  href,
  organizationId,
}: IconButtonProps) {
  // ボタンやリンクに共通するスタイル設定
  const commonProps = {
    className:
      "flex flex-col items-center space-y-1 w-full text-muted-foreground p-2",
    style: { width: "60px", height: "60px" },
    "aria-label": label, // スクリーンリーダー用ラベル
  };

  return href ? (
    <a href={href} {...commonProps}>
      <Icon style={{ width: "32px", height: "32px" }} /> {/* アイコンを表示 */}
      <span className="text-xs">{label}</span> {/* ボタンラベルを表示 */}
    </a>
  ) : (
    <Button
      variant="ghost"
      onClick={() => onClick && onClick(organizationId)} // props経由でorganizationIdを渡す
      {...commonProps}
    >
      <Icon style={{ width: "32px", height: "32px" }} /> {/* アイコンを表示 */}
      <span className="text-xs">{label}</span> {/* ボタンラベルを表示 */}
    </Button>
  );
}

// フッターコンポーネント
export default function Footer() {
  const router = useRouter(); // Next.jsのルーターを使用
  const { organizationId } = useOrganization(); // ContextからorganizationIdを取得

  return (
    <div className="fixed bottom-0 w-full z-50 bg-background p-1">
      {/* フッターを画面下部に固定するスタイル */}
      <div className="flex justify-around">
        {/* ホームボタン */}
        <IconButton
          icon={House}
          label="ホーム"
          onClick={() => {
            router.push("/"); // ホームページに遷移
          }}
        />
        {/* メッセージボタン */}
        <IconButton
          icon={MessageCircleHeart}
          label="Message"
          organizationId={organizationId} // organizationIdをpropsで渡す
          onClick={(id) => {
            if (id) {
              // 必要に応じてルーティングなどの処理を追加
              router.push("/message_app");
            }
          }}
        />
        {/* 開発中ボタン */}
        <IconButton icon={Pickaxe} label="開発中" href="/development" />
      </div>
    </div>
  );
}
