"use client"; // クライアントサイドでレンダリングすることを指定

import { useEffect, useState, useCallback } from "react";
import MessageDetailsDialog from "./MessageDetailsDialog"; // メッセージ詳細を表示するダイアログ
import SendMessageApp from "@/components/SendMessageApp"; // メッセージ送信フォーム
import MessageCard from "@/components/MessageCard";
import { Message, Reply } from "@/components/types"; // 型定義をインポート
import fetchMessagesData from "@/components/fetchMessagesData"; // fetchDataをインポート

// メインのアプリコンポーネント
export default function MessageApp() {
  const [messages, setMessages] = useState<Message[]>([]); // メッセージリストの状態を管理
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null); // 選択されたメッセージを管理
  const [error, setError] = useState<string | null>(null); // エラーを管理
  const [loading, setLoading] = useState<boolean>(false); // ローディング状態を管理
  const [organizationId, setOrganizationId] = useState<number>(1); // 組織IDを管理

  // サーバーからメッセージを取得する関数
  const fetchMessages = useCallback(async () => {
    setLoading(true); // データ取得中の状態にする
    setError(null); // エラーをリセット

    try {
      // データをサーバーサイドで取得
      const data = await fetchMessagesData(organizationId);

      setMessages(data); // 取得したデータをそのまま使用
    } catch (error) {
      console.error("メッセージ取得エラー:", error);
      setError(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false); // データ取得完了
    }
  }, [organizationId]);

  // 初回レンダリング時にメッセージを取得
  // organizationIdが変更されたときにメッセージを再取得
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]); // 依存配列に fetchMessages を追加

  // 「いいね」ボタンがクリックされたときの処理
  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // 親要素のクリックイベントを止める

    // 楽観的にローカル状態を更新
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.message_id === id
          ? { ...msg, count_of_likes: (msg.count_of_likes || 0) + 1 }
          : msg
      )
    );

    try {
      const response = await fetch(`/api/like_message/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // キャッシュを無効化
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // サーバー通信成功時には何もしない（リロード時に最新データを取得する）
    } catch (error) {
      console.error("Failed to like the message:", error);

      // エラー発生時に元の値に戻す
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.message_id === id
            ? { ...msg, count_of_likes: (msg.count_of_likes || 1) - 1 }
            : msg
        )
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
        <SendMessageApp organizationId={organizationId} />
        {/* 追加 */}
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
          organizationId={organizationId}
          onClose={() => setSelectedMessage(null)}
          onReply={(reply) => addReply(selectedMessage.message_id, reply)}
        />
      )}
    </div>
  );
}
