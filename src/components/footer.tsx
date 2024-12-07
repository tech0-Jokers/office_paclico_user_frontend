"use client"; // このコンポーネントはクライアントサイドで動作する必要があることを示します

// 必要なコンポーネントやライブラリをインポート
import { Button } from "@/components/ui/button"; // ボタンコンポーネント
import { MessageCircleHeart, Pickaxe, House } from "lucide-react"; // アイコン（Reactコンポーネント）
import { useRouter } from "next/navigation"; // ルーティングを行うためのNext.jsのフック
import { useOrganization } from "@/context/OrganizationContext"; // 組織情報を取得するカスタムフック

// アイコン付きボタンのプロパティ（渡す値の型）を定義
type IconButtonProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // アイコン（SVG形式のReactコンポーネント）
  label: string; // ボタンに表示するテキスト
  onClick?: (organizationId?: string) => void; // ボタンがクリックされたときの処理（任意）
  href?: string; // リンク先のURL（任意）
  organizationId?: string; // 組織ID（必要に応じて渡す）
};

// アイコン付きボタンコンポーネント
function IconButton({
  icon: Icon, // 使用するアイコンをプロパティから取得
  label, // ボタンのテキスト
  onClick = () => {}, // デフォルトで空の関数を設定（省略時エラー防止）
  href, // リンク先（任意）
  organizationId, // 組織ID（必要に応じて使用）
}: IconButtonProps) {
  // ボタンやリンクに共通するスタイル設定を定義
  const commonProps = {
    className:
      "flex flex-col items-center space-y-1 w-full text-muted-foreground p-2", // スタイルクラス
    style: { width: "60px", height: "60px" }, // 幅と高さ
    "aria-label": label, // アクセシビリティのためのラベル
  };

  // リンクが指定されている場合は <a> タグを使用
  if (href) {
    return (
      <a href={href} {...commonProps}>
        {/* アイコンを表示 */}
        <Icon style={{ width: "32px", height: "32px" }} />
        {/* ボタンのテキストを表示 */}
        <span className="text-xs">{label}</span>
      </a>
    );
  }

  // リンクがない場合はボタンを使用
  return (
    <Button
      variant="ghost" // ボタンスタイルを「ゴースト」に設定
      onClick={() => onClick(organizationId)} // ボタンがクリックされたときにonClickを実行
      {...commonProps}
    >
      {/* アイコンを表示 */}
      <Icon style={{ width: "32px", height: "32px" }} />
      {/* ボタンのテキストを表示 */}
      <span className="text-xs">{label}</span>
    </Button>
  );
}

// フッターコンポーネント
export default function Footer() {
  const router = useRouter(); // Next.jsのルーティングフックを使用
  const { organizationId } = useOrganization(); // Contextから組織IDを取得

  return (
    // フッターを画面下部に固定するためのコンテナ
    <div className="fixed bottom-0 w-full z-50 bg-background p-1">
      {/* フッター内部のボタンを横並びに配置 */}
      <div className="flex justify-around">
        {/* ホームボタン */}
        <IconButton
          icon={House} // アイコンに「家」を指定
          label="ホーム" // ボタンのラベル
          onClick={() => router.push("/")} // クリック時にホームページに遷移
        />
        {/* メッセージボタン */}
        <IconButton
          icon={MessageCircleHeart} // アイコンに「ハート付きメッセージ」を指定
          label="Message" // ボタンのラベル
          organizationId={organizationId} // 組織IDを渡す
          onClick={(id) => {
            // 組織IDがある場合のみルーティングを実行
            if (id) {
              router.push("/message_app");
            }
          }}
        />
        {/* 開発中ボタン */}
        <IconButton
          icon={Pickaxe} // アイコンに「ツルハシ」を指定
          label="開発中" // ボタンのラベル
          organizationId={organizationId} // 組織IDを渡す
          onClick={(id) => {
            // 組織IDがある場合のみルーティングを実行
            if (id) {
              router.push("/development");
            }
          }}
        />
      </div>
    </div>
  );
}
