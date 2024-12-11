// LoadingScreen.tsx
// このコンポーネントはローディング中の画面を表示するためのものです。

export default function LoadingScreen({ stage }: { stage: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* アニメーション付きのスピナー */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mb-4"></div>
      {/* 現在のローディングステージを表示 */}
      <p className="text-lg font-semibold text-gray-800">{stage}</p>
    </div>
  );
}
