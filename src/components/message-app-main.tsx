"use client";
import { useEffect, useState } from "react";
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null); // エラーメッセージのための状態
  const [loading, setLoading] = useState<boolean>(false); // ローディング状態のための状態

  // APIからメッセージを取得する関数
  const fetchMessages = async () => {
    setLoading(true); // データ取得開始時にローディング状態をセット
    try {
      const response = await fetch("/api/messages"); // APIエンドポイントを指定
      if (!response.ok) {
        throw new Error("メッセージの取得に失敗しました");
      }
      const data: Message[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
      setError(error.message); // エラーメッセージを状態にセット
    } finally {
      setLoading(false); // データ取得完了時にローディング状態を解除
    }
  };

  useEffect(() => {
    fetchMessages(); // コンポーネントのマウント時にメッセージを取得
  }, []);

  // 新しいメッセージを追加する関数
  const addMessage = (
    newMessage: Omit<Message, "id" | "likes" | "replies">
  ) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, id: prevMessages.length + 1, likes: 0, replies: [] },
    ]);
  };

  // メッセージに「いいね」を追加する関数
  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // 親要素のクリックイベントを止める
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
  };

  // メッセージに返信を追加する関数
  const addReply = (messageId: number, reply: Omit<Reply, "id">) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
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
      {loading && <p>メッセージを取得中です...</p>}{" "}
      {/* ローディングインジケーター */}
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* エラーメッセージ表示 */}
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
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onSelect={setSelectedMessage}
            onLike={handleLike}
          />
        ))}
      </div>
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
