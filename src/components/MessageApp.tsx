"use client"; // クライアントサイドでレンダリングすることを指定

import { useEffect, useState } from "react";
import MessageDetailsDialog from "./MessageDetailsDialog"; // メッセージ詳細を表示するダイアログ
import SendMessageApp from "@/components/SendMessageApp"; // メッセージ送信フォーム
import MessageCard from "@/components/MessageCard";
import { Message, Reply } from "@/components/types"; // 型定義をインポート
import fetchMessagesData from "@/components/fetchMessagesData"; // fetchDataをインポート

interface PageProps {
  params: { organizationId: string };
}

// メインのアプリコンポーネント
export default function MessageApp() {
  const [messages, setMessages] = useState<Message[]>([]); // メッセージリストの状態を管理
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null); // 選択されたメッセージを管理
  const [error, setError] = useState<string | null>(null); // エラーを管理
  const [loading, setLoading] = useState<boolean>(false); // ローディング状態を管理
  const [organizationId, setOrganizationId] = useState<number>(1); // 組織IDを管理

  //const organizationId = 2; // 仮の組織ID（実際のアプリでは動的に変更）

  // サーバーからメッセージを取得する関数
  const fetchMessages = async () => {
    setLoading(true); // データ取得中の状態にする
    setError(null); // エラーをリセット

    try {
      // データをサーバーサイドで取得
      const data = await fetchMessagesData(organizationId);

      // サーバーのデータをフロントエンド用の形式に変換
      const mappedMessages = data.map((msg: any) => ({
        message_id: msg.message_id,
        message_content: msg.message_content,
        sender_user_id: msg.sender_user_id,
        receiver_user_id: msg.receiver_user_id,
        sender_user_name: msg.sender_user_name,
        receiver_user_name: msg.receiver_user_name,
        product_id: msg.product_id,
        product_name: msg.product_name,
        send_date: msg.send_date ? new Date(msg.send_date).toISOString() : null, // Dateをstringに変換
        likes: 0, // 初期値として「いいね」を0に設定
        replies: [], // 初期値として返信リストを空に設定
        product_image_url: msg.product_image_url || null, // APIに画像URLが含まれると仮定
      }));

      setMessages(mappedMessages); // メッセージを状態に保存
    } catch (error) {
      console.error("メッセージ取得エラー:", error);
      setError(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false); // データ取得完了
    }
  };

  // 初回レンダリング時にメッセージを取得
  // organizationIdが変更されたときにメッセージを再取得
  useEffect(() => {
    fetchMessages();
  }, [organizationId]);

  // 「いいね」ボタンがクリックされたときの処理
  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // 親要素のクリックイベントを止める
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.message_id === id ? { ...msg, likes: msg.likes + 1 } : msg
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
        headers: {
          "Content-Type": "application/json",
        }, // JSON形式でデータを送信
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
        msg.message_id === messageId
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

      {/* 組織ID選択プルダウン */}
      <div className="flex items-center mb-4">
        <label htmlFor="organization-select" className="text-purple-800 mr-2">
          組織を選択:
        </label>
        <select
          id="organization-select"
          className="p-2 border border-purple-300 rounded"
          onChange={(e) => setOrganizationId(parseInt(e.target.value, 10))}
        >
          <option value="1">組織1</option>
          <option value="2">組織2</option>
          <option value="3">組織3</option>
        </select>
      </div>

      {/* 新しいメッセージ送信フォーム */}
      <div className="flex justify-start mb-4">
        <SendMessageApp addMessage={addMessage} />
      </div>

      {/* メッセージリストの表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {messages.map((message) => (
          <MessageCard
            key={message.message_id} // 各メッセージに一意のキーを設定
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
          onReply={(reply) => addReply(selectedMessage.message_id, reply)}
        />
      )}
    </div>
  );
}
