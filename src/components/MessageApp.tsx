"use client"; // クライアントサイドでのレンダリングを指定
import { useEffect, useState } from "react";
import MessageCard from "./MessageCard"; // メッセージカードコンポーネント
import MessageDetailsDialog from "./MessageDetailsDialog"; // メッセージ詳細ダイアログ
import SendMessageApp from "@/components/SendMessageApp"; // メッセー��送信コンポーネント
import { Message, Reply } from "@/components/types"; // 型定義

// メインアプリケーションコンポーネント
export default function MessageApp() {
  // メッセージリストを管理する状態変数
  const [messages, setMessages] = useState<Message[]>([]);

  // 選択されたメッセージを管理する状態変数
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // エラーメッセージを格納する状態変数
  const [error, setError] = useState<string | null>(null);

  // ローディング状態を管理する状態変数
  const [loading, setLoading] = useState<boolean>(false);

  // サーバーからメッセージを取得する関数
  const fetchMessages = async () => {
    setLoading(true); // データ取得中のローディング状態を開始
    try {
      const response = await fetch("/api/messages"); // APIエンドポイントを呼び出し
      if (!response.ok) {
        throw new Error("メッセージの取得に失敗しました"); // エラーの場合、例外をスロー
      }
      const data: Message[] = await response.json(); // メッセージデータを取得
      setMessages(data); // メッセージリストを更新
    } catch (error) {
      console.error("メッセージ取得エラー:", error);
      setError(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false); // ローディング状態を終了
    }
  };

  // 初回レンダリング時にメッセージを取得
  useEffect(() => {
    fetchMessages();
  }, []);

  // 「いいね」を追加する関数
  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // 親要素のクリックイベントを止める
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
  };

  // 新しいメッセージをリストに追加する関数
  const addMessage = async (
    newMessage: Omit<Message, "id" | "likes" | "replies">
  ) => {
    try {
      const response = await fetch("/api/send_message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage), // IDの生成をサーバーに任せる
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedMessage = await response.json();

      // メッセージリストに新しいメッセージを追加
      setMessages((prevMessages) => [...prevMessages, { ...savedMessage }]);
    } catch (error) {
      console.error("メッセージ追加エラー:", error);
      setError(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    }
  };

  // 返信を追加する関数
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
      {/* ローディング中の表示 */}
      {loading && <p>メッセージを取得中です...</p>}
      {/* エラーがある場合に表示 */}
      {error && <p className="text-red-500">{error}</p>}

      {/* 新しいメッセージ送信フォーム */}
      <div className="flex justify-start mb-4">
        <SendMessageApp addMessage={addMessage} />
      </div>

      {/* メッセージリストの表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {messages.map((message) => (
          <MessageCard
            key={message.id} // 各メッセージに一意のキーを指定
            message={message} // メッセージデータを渡す
            onSelect={setSelectedMessage} // メッセージ選択時のコールバック
            onLike={handleLike} // 「いいね」追加時のコールバック
          />
        ))}
      </div>

      {/* 選択されたメッセージの詳細ダイアログ */}
      {selectedMessage && (
        <MessageDetailsDialog
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)} // ダイアログを閉じる
          onReply={(reply) => addReply(selectedMessage.id, reply)} // 返信を追加
        />
      )}
    </div>
  );
}
