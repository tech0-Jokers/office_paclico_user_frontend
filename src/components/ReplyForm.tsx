// ReplyForm.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// 返信を追加するフォームコンポーネント
export default function ReplyForm({
  onSubmit,
}: {
  onSubmit: (reply: Omit<Reply, "id">) => void;
}) {
  const [from, setFrom] = useState(""); // 返信者の名前
  const [content, setContent] = useState(""); // 返信の内容

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ
    onSubmit({ from, content }); // 親コンポーネントに返信内容を送信
    setFrom(""); // フォームをリセット
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="replyFrom">From</Label>
        <Input
          id="replyFrom"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="replyContent">返信内容</Label>
        <Textarea
          id="replyContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>
      <Button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        返信を送信
      </Button>
    </form>
  );
}
