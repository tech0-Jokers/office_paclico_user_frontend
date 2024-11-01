import CandyShop from "@/components/candy-shop"; // コンポーネントのインポート
import ChocolateShop from "@/components/chocolate-shop"; // コンポーネントのインポート

export default function HomePage() {
  return (
    <div>
      <div>
        <h1>Welcome to the Candy Shop</h1>
        <CandyShop /> {/* CandyShop コンポーネントを表示 */}
      </div>
      <div>
        <h1>Welcome to the Chocolate Shop</h1>
        <ChocolateShop /> {/* ChocolateShop コンポーネントを表示 */}
      </div>
    </div>
  );
}
