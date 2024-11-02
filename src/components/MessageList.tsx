// MessageList.tsx
"use client";
import { useState } from "react";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/types";

const predefinedImages = [
  "/placeholder1.png",
  "/placeholder2.png",
  "/placeholder3.png",
];

export default function MessageList() {
  // メッセージの初期状態を設定
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      to: "田中さん",
      from: "鈴木",
      message: "ありがとうございます！",
      treat: "チョコレート",
      likes: 0,
      replies: [],
      imageUrl: predefinedImages[0],
    },
    {
      id: 2,
      to: "佐藤さん",
      from: "高橋",
      message: "頑張ってください！",
      treat: "クッキー",
      likes: 0,
      replies: [],
      imageUrl: predefinedImages[1],
    },
  ]);

  // メッセージ選択時の処理
  const handleSelect = (selectedMessage: Message) => {
    console.log("Selected message:", selectedMessage);
    // 必要に応じて他の処理も追加
  };

  // いいねボタンが押されたときの処理
  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // イベント伝播を防止
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          onSelect={handleSelect}
          onLike={handleLike}
        />
      ))}
    </div>
  );
}
