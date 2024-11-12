// MessageCard.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Message } from "@/components/types"; // 型定義をインポート

// メッセージカードコンポーネント
export default function MessageCard({
  message,
  onSelect,
  onLike,
}: {
  message: Message; // 表示するメッセージデータ
  onSelect: (message: Message) => void; // メッセージを選択する関数
  onLike: (e: React.MouseEvent, id: number) => void; // 「いいね」を追加する関数
}) {
  return (
    <Card
      className="bg-white cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect(message)}
    >
      <CardContent className="p-4">
        <div className="aspect-video relative mb-2">
          <Image
            src={message.imageUrl}
            alt="Message image"
            fill
            className="object-contain rounded-md"
            priority // 優先的に読み込む
          />
        </div>
        <p className="font-semibold text-purple-700">To: {message.to}</p>
        <p className="text-purple-600">From: {message.from}</p>
        <p className="text-purple-800 mt-2">{message.message}</p>
        <div className="mt-2 flex items-center justify-between">
          {/* 「いいね」ボタン */}
          <Button
            size="sm"
            variant="outline"
            className="text-purple-600 border-purple-600 flex items-center gap-1"
            onClick={(e) => onLike(e, message.id)}
          >
            👍 いいね{" "}
            <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 rounded-md text-purple-800 font-semibold">
              {message.likes}
            </span>
          </Button>
          <span className="text-sm text-purple-600">
            {message.replies.length} 件の返信
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
