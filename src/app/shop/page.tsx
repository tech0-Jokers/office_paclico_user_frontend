"use client";
import AmbassadorShop from "@/components/AmbassadorShop"; // コンポーネントのインポート

export default function HomePage() {
  return (
    <div>
      <div>
        <AmbassadorShop organizationId={0} />{" "}
        {/* AmbassadorShop コンポーネントを表示 */}
      </div>
    </div>
  );
}
