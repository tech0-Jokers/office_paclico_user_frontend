// NewMessageForm.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { predefinedMessages, predefinedImages } from "@/components/constants";

// 新しいメッセージを作成するフォームコンポーネント
export default function NewMessageForm({
  onSubmit,
}: {
  onSubmit: (message: Omit<Message, "id" | "likes" | "replies">) => void;
}) {
  // 各フィールドの入力値を管理する状態変数
  const [to, setTo] = useState(""); // 送信先
  const [from, setFrom] = useState(""); // 送信元
  const [message, setMessage] = useState(predefinedMessages[0]); // メッセージ内容
  const [treat, setTreat] = useState(""); // お菓子の種類
  const [imageUrl, setImageUrl] = useState(predefinedImages[0]); // 画像URL
  const [messageInputType, setMessageInputType] = useState<"select" | "custom">(
    "select"
  ); // メッセージ入力方法の選択

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ
    onSubmit({ to, from, message, treat, imageUrl }); // 親コンポーネントにメッセージ内容を送信
    // フォーム内容をリセット
    setTo("");
    setFrom("");
    setMessage(messageInputType === "select" ? predefinedMessages[0] : "");
    setTreat("");
    setImageUrl(predefinedImages[0]);
    setMessageInputType("select");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 送信先フィールド */}
      <div>
        <Label htmlFor="to">To</Label>
        <Input
          id="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
      </div>
      {/* 送信元フィールド */}
      <div>
        <Label htmlFor="from">From</Label>
        <Input
          id="from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
      </div>
      {/* メッセージ入力方法の選択 */}
      <div>
        <Label>メッセージ入力方法</Label>
        <div className="flex space-x-2 mt-1">
          <Button
            type="button"
            variant={messageInputType === "select" ? "default" : "outline"}
            onClick={() => setMessageInputType("select")}
          >
            定型文から選択
          </Button>
          <Button
            type="button"
            variant={messageInputType === "custom" ? "default" : "outline"}
            onClick={() => setMessageInputType("custom")}
          >
            自由に入力
          </Button>
        </div>
      </div>
      {/* メッセージ内容の入力（定型文または自由入力） */}
      {messageInputType === "select" ? (
        <div>
          <Label htmlFor="message">メッセージ</Label>
          <Select value={message} onValueChange={setMessage} required>
            <SelectTrigger>
              <SelectValue placeholder="メッセージを選択" />
            </SelectTrigger>
            <SelectContent>
              {predefinedMessages.map((msg, index) => (
                <SelectItem key={index} value={msg}>
                  {msg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div>
          <Label htmlFor="customMessage">カスタムメッセージ</Label>
          <Textarea
            id="customMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="min-h-[100px]"
          />
        </div>
      )}
      {/* お菓子の種類選択 */}
      <div>
        <Label htmlFor="treat">お菓子</Label>
        <Select value={treat} onValueChange={setTreat} required>
          <SelectTrigger>
            <SelectValue placeholder="お菓子を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="チョコレート">チョコレート</SelectItem>
            <SelectItem value="クッキー">クッキー</SelectItem>
            <SelectItem value="キャンディ">キャンディ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* 画像選択 */}
      <div>
        <Label htmlFor="image">画像</Label>
        <Select value={imageUrl} onValueChange={setImageUrl} required>
          <SelectTrigger>
            <SelectValue placeholder="画像を選択" />
          </SelectTrigger>
          <SelectContent>
            {predefinedImages.map((img, index) => (
              <SelectItem key={index} value={img}>
                画像 {index + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* 選択した画像のプレビュー */}
      <div className="aspect-video relative">
        <Image
          src={imageUrl}
          alt="Selected image"
          layout="fill" // Next.jsのImageコンポーネントの場合、`fill`レイアウトを指定します。
          className="object-cover rounded-md"
        />
      </div>

      {/* 送信ボタン */}
      <Button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        送信
      </Button>
    </form>
  );
}
