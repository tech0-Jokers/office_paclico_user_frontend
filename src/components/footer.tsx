"use client"; // このコンポーネントはクライアントサイドで動作します

import { Button } from "@/components/ui/button"; // ボタンコンポーネントをインポート
import { MessageCircleHeart, Pickaxe, House } from "lucide-react"; // アイコンをインポート
import { useSelectedOrg } from "@/context/SelectedOrgContext"; // コンテキストフックをインポート
import { useRouter } from "next/navigation"; // Next.jsのルーターを使用

// IconButtonコンポーネントのプロパティ型
type IconButtonProps = {
  icon: React.ElementType; // アイコンの型（Reactのコンポーネント型）
  label: string; // ボタンのラベル
  onClick?: () => void; // ボタンがクリックされたときの処理（省略可能）
  href?: string; // リンク先のURL（省略可能）
};

// アイコン付きボタンコンポーネント
function IconButton({ icon: Icon, label, onClick, href }: IconButtonProps) {
  // ボタンやリンクに共通するスタイル設定
  const commonProps = {
    className:
      "flex flex-col items-center space-y-1 w-full text-muted-foreground p-2",
    style: { width: "60px", height: "60px" },
    "aria-label": label, // スクリーンリーダー用ラベル
  };

  // hrefが指定されている場合はリンクとして動作
  return href ? (
    <a href={href} {...commonProps}>
      <Icon style={{ width: "32px", height: "32px" }} /> {/* アイコンを表示 */}
      <span className="text-xs">{label}</span> {/* ボタンラベルを表示 */}
    </a>
  ) : (
    // hrefがない場合は通常のボタンとして動作
    <Button variant="ghost" onClick={onClick} {...commonProps}>
      <Icon style={{ width: "32px", height: "32px" }} /> {/* アイコンを表示 */}
      <span className="text-xs">{label}</span> {/* ボタンラベルを表示 */}
    </Button>
  );
}

// フッターコンポーネント
export default function Footer() {
  const { setSelectedOrgId } = useSelectedOrg(); // 状態リセット関数を取得
  const router = useRouter(); // Next.jsのルーターを使用

  return (
    <div className="fixed bottom-0 w-full z-50 bg-background p-1">
      {/* フッターを画面下部に固定するスタイル */}
      <div className="flex justify-around">
        {/* ホームボタン */}
        <IconButton
          icon={House}
          label="ホーム"
          onClick={() => {
            setSelectedOrgId(null); // 状態をリセット
            router.push("/"); // ホームページに遷移
          }}
        />
        {/* メッセージボタン */}
        <IconButton
          icon={MessageCircleHeart}
          label="Message"
          href="/message_app"
        />
        {/* 開発中ボタン */}
        <IconButton icon={Pickaxe} label="開発中" href="/development" />
      </div>
    </div>
  );
}
