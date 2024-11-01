import CandyShop from "@/components/candy-shop"; // コンポーネントのインポート
import ChocolateShop from "@/components/chocolate-shop"; // コンポーネントのインポート
import MessageAPP from "@/components/message-app"; // コンポーネントのインポート
import MessageAppMain from "@/components/message-app-main"; // コンポーネントのインポート

export default function HomePage() {
  return (
    <div>
      <div>
        <MessageAppMain /> {/* MessageAppMain コンポーネントを表示 */}
      </div>
    </div>
  );
}
