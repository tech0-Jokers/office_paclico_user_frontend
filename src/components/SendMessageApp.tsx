// Reactライブラリをインポート
import React from "react";
import SendButton from "@/components/SendButton"; // 送信ボタンコンポーネントをインポート

// メッセージの型を定義
interface Message {
  id: number; // メッセージの一意のID
  text: string; // メッセージの本文
  likes: number; // 「いいね」の数
  replies: Message[]; // メッセージへの返信リスト
}

// アプリケーションのメインコンポーネント
export default function SendMessageApp() {
  // メッセージリストを管理する状態変数を宣言
  const [messages, setMessages] = React.useState<Message[]>([]);

  // 新しいメッセージを追加する関数
  const addMessage = (
    newMessage: Omit<Message, "id" | "likes" | "replies">
  ) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        ...newMessage,
        id: prevMessages.length + 1, // IDはリストの長さ+1で設定
        likes: 0, // 初期の「いいね」数は0
        replies: [], // 返信リストは空の配列で初期化
      },
    ]);
  };

  return (
    <div>
      {/* メッセージリストを表示 */}
      <div>
        {messages.map((message) => (
          <div key={message.id} className="border p-2 mb-2">
            <p>{message.text}</p>
            <span>Likes: {message.likes}</span>
          </div>
        ))}
      </div>

      {/* 送信ボタンコンポーネントを配置 */}
      <SendButton
        onClick={() => console.log("ボタンがクリックされました")}
        addMessage={addMessage}
      />
    </div>
  );
}
