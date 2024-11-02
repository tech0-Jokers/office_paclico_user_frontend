"use client";
import { useState } from "react";
import MessageCard from "./MessageCard"; // メッセージカードコンポーネントのインポート
import NewMessageForm from "./NewMessageForm"; // 新しいメッセージフォームのインポート
import MessageDetailsDialog from "./MessageDetailsDialog"; // メッセージ詳細ダイアログのインポート
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Message, Reply } from "@/components/types"; // 型定義をインポート

// メインのアプリケーションコンポーネント
export default function MessageApp() {
  // メッセージと選択されたメッセージを管理する状態
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      to: "高橋さん",
      from: "鈴木",
      message: "ありがとうございます！",
      treat: "チョコレート",
      likes: 0,
      replies: [],
      imageUrl: "/placeholder.svg?height=200&width=200&text=Image1",
    },
    {
      id: 2,
      to: "伊藤さん",
      from: "高橋",
      message: "頑張ってください！",
      treat: "クラッカー",
      likes: 0,
      replies: [],
      imageUrl: "/placeholder.svg?height=200&width=200&text=Image1",
    },
    // 他のメッセージも同様に定義可能
  ]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // 新しいメッセージを追加する関数
  const addMessage = (
    newMessage: Omit<Message, "id" | "likes" | "replies">
  ) => {
    setMessages([
      ...messages,
      { ...newMessage, id: messages.length + 1, likes: 0, replies: [] },
    ]);
  };

  // メッセージに「いいね」を追加する関数
  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // 親要素のクリックイベントを止める
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
  };

  // メッセージに返信を追加する関数
  const addReply = (messageId: number, reply: Omit<Reply, "id">) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              replies: [
                ...msg.replies,
                { ...reply, id: msg.replies.length + 1 },
              ],
            }
          : msg
      )
    );
  };

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">
        メッセージアプリ
      </h1>
      {/* 新しいメッセージを作成するためのダイアログ */}
      <div className="flex justify-start mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              新しいメッセージを作成
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新しいメッセージ</DialogTitle>
            </DialogHeader>
            <NewMessageForm onSubmit={addMessage} />
          </DialogContent>
        </Dialog>
      </div>

      {/* メッセージ一覧を表示 */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* メッセージごとにMessageCardコンポーネントを表示 */}
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onSelect={setSelectedMessage}
            onLike={handleLike}
          />
        ))}
      </div>

      {/* 選択されたメッセージの詳細を表示するダイアログ */}
      {selectedMessage && (
        <MessageDetailsDialog
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onReply={(reply) => addReply(selectedMessage.id, reply)}
        />
      )}
    </div>
  );
}
