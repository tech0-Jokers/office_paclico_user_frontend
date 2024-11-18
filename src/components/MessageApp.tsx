"use client"; // クライアントサイドでレンダリングすることを指定

import { useEffect, useState } from "react";
import Image from "next/image"; // Next.jsの画像コンポーネントをインポート
import MessageDetailsDialog from "./MessageDetailsDialog"; // メッセージ詳細を表示するダイアログ
import SendMessageApp from "@/components/SendMessageApp"; // メッセージ送信フォーム
import { Message, Reply } from "@/components/types"; // 型定義をインポート

// メッセージリストを表示するカードコンポーネント
const MessageCard = ({
  message,
  onSelect,
  onLike,
}: {
  message: Message;
  onSelect: (message: Message) => void;
  onLike: (e: React.MouseEvent, id: number) => void;
}) => {
  return (
    <div
      className="card border p-4 shadow-md"
      onClick={() => onSelect(message)} // カードクリック時に詳細ダイアログを開く
    >
      <h2 className="font-bold text-lg">{message.content}</h2>
      {/* 画像が存在する場合に表示、なければプレースホルダーを表示 */}
      <Image
        src={message.imageUrl || "/placeholder.png"} // デフォルトの画像を設定
        alt="Message Image"
        width={100}
        height={100}
      />
      <button
        className="mt-2 text-blue-500"
        onClick={(e) => onLike(e, message.id)} // 「いいね」ボタンのクリックイベント
      >
        いいね ({message.likes})
      </button>
    </div>
  );
};

// メインのアプリコンポーネント
export default function MessageApp() {
  const [messages, setMessages] = useState<Message[]>([]); // メッセージリストの状態を管理
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null); // 選択されたメッセージを管理
  const [error, setError] = useState<string | null>(null); // エラーを管理
  const [loading, setLoading] = useState<boolean>(false); // ローディング状態を管理

  const organizationId = 1; // 仮の組織ID（実際のアプリでは動的に変更）

  // サーバーからメッセージを取得する関数
  const fetchMessages = async () => {
    setLoading(true); // データ取得中の状態にする
    const requestUrl = `/api/messages/${organizationId}`; // APIのエンドポイントを設定

    try {
      const response = await fetch(requestUrl); // サーバーにリクエストを送信

      if (!response.ok) {
        // レスポンスがエラーの場合、エラーメッセージを投げる
        throw new Error("メッセージの取得に失敗しました");
      }

      const data = await response.json(); // サーバーからのデータを取得

      // サーバーのデータをフロントエンド用の形式に変換
      const mappedMessages = data.messages.map((msg: any) => ({
        id: msg.message_id,
        content: msg.message_content,
        senderId: msg.sender_user_id,
        receiverId: msg.receiver_user_id,
        productId: msg.product_id,
        date: msg.send_date ? new Date(msg.send_date) : null,
        likes: 0, // 初期値として「いいね」を0に設定
        replies: [], // 初期値として返信リストを空に設定
        imageUrl: msg.image_url || null, // APIに画像URLが含まれると仮定
      }));

      setMessages(mappedMessages); // メッセージを状態に保存
    } catch (error) {
      console.error("メッセージ取得エラー:", error);
      setError(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false); // ローディングを終了
    }
  };

  // 初回レンダリング時にメッセージを取得
  useEffect(() => {
    fetchMessages();
  }, []);

  // 「いいね」ボタンがクリックされたときの処理
  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // 親要素のクリックイベントを止める
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
      )
    ); // 該当するメッセージの「いいね」数を増加
  };

  // 新しいメッセージをリストに追加する関数
  const addMessage = async (
    newMessage: Omit<Message, "id" | "likes" | "replies">
  ) => {
    try {
      const response = await fetch("/api/send_message", {
        method: "POST", // メッセージを送信するHTTPメソッド
        headers: { "Content-Type": "application/json" }, // JSON形式でデータを送信
        body: JSON.stringify(newMessage), // 新しいメッセージをJSON形式で送信
      });

      if (!response.ok) {
        // サーバーエラーが発生した場合
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedMessage = await response.json(); // サーバーから保存されたメッセージを取得

      setMessages((prevMessages) => [...prevMessages, { ...savedMessage }]); // 取得したメッセージをリストに追加
    } catch (error) {
      console.error("メッセージ追加エラー:", error);
      setError(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    }
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
                { ...reply, id: msg.replies.length + 1 }, // 新しい返信に一意のIDを付与
              ],
            }
          : msg
      )
    );
  };

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      {/* アプリタイトル */}
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
            key={message.id} // 各メッセージに一意のキーを設定
            message={message}
            onSelect={setSelectedMessage}
            onLike={handleLike}
          />
        ))}
      </div>

      {/* 選択されたメッセージの詳細ダイアログ */}
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
