"use client";
import { useEffect, useState } from "react";
import MessageCard from "./MessageCard"; // メッセージカードコンポーネントのインポート
import MessageDetailsDialog from "./MessageDetailsDialog"; // メッセージ詳細ダイアログのインポート
import { Message, Reply } from "@/components/types"; // 型定義をインポート
import SendMessageButton from "@/components/SendMessageButton";

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
        throw new Error("メッセージの取得に失敗しました"); // エラーをスロー
      }
      const data: Message[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);

      // errorがError型であることを確認
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage); // エラーメッセージを状態にセット
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
      {/* ローディングインジケーター */}
      {loading && <p>メッセージを取得中です...</p>}
      {/* エラーメッセージ表示 */}
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* 新しいメッセージを追加するフォーム */}
      <div className="flex justify-start mb-4">
        <SendMessageButton />
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
