import Link from "next/link"; // ページ間リンクを作成するためのコンポーネントをインポート
import { Button } from "@/components/ui/button"; // shadcn-uiのButtonコンポーネントをインポート
import { House, Pickaxe, Image, LucideIcon } from "lucide-react"; // 各ページで使うアイコンをインポート

// アイコン付きボタンのプロパティ型を定義
type IconButtonProps = {
  href: string; // ボタンのリンク先URL
  icon: LucideIcon; // アイコンのコンポーネント型（LucideIconを指定）
  label: string; // ボタンのラベル
};

// アイコン付きボタンのコンポーネントを定義
// 各ページボタンの構造を共通化して再利用できるようにします
function IconButton({ href, icon: Icon, label }: IconButtonProps) {
  return (
    // Linkコンポーネントでボタンをリンク化
    <Link href={href} prefetch={false}>
      <Button
        variant="ghost" // ボタンのスタイルを「ghost」タイプに設定（背景なし）
        className="flex flex-col items-center space-y-1 w-full text-muted-foreground p-2"
        style={{ width: "60px", height: "60px" }} // ボタンコンテナのサイズを調整
      >
        {/* size プロパティでアイコンのサイズを指定 */}
        <Icon style={{ width: "32px", height: "32px" }} />
        <span className="text-xs">{label}</span> {/* ボタンのラベルを表示 */}
      </Button>
    </Link>
  );
}

// Footerコンポーネントを定義
// ページ下部に表示されるフッター部分のレイアウトを構成します
export default function Footer(): JSX.Element {
  return (
    <div className="fixed bottom-0 w-full z-50 bg-background p-1">
      {/* フッターのデザイン設定。画面下部に固定表示し、背景色とパディングを調整 */}

      <div className="flex justify-around">
        {/* アイコン付きボタンを横並びで均等に配置するためにflexレイアウトを使用 */}

        {/* ホームボタン */}
        <IconButton href="/" icon={House} label="Home" />

        {/* アルバムボタン */}
        <IconButton href="/photo_album" icon={Image} label="アルバム" />

        {/* 開発中のボタン */}
        <IconButton href="/development" icon={Pickaxe} label="開発中" />
      </div>
    </div>
  );
}
