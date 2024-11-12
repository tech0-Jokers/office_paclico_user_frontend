"use client"; // クライアントサイドでのレンダリングを指定します

import { useState } from "react"; // ReactのuseStateフックをインポート
import { Button } from "@/components/ui/button"; // ボタンコンポーネントをインポート
import { Input } from "@/components/ui/input"; // 入力フィールドコンポーネントをインポート
import { Label } from "@/components/ui/label"; // ラベルコンポーネントをインポート
import { Textarea } from "@/components/ui/textarea"; // テキストエリアコンポーネントをインポート
import { Reply } from "@/components/types"; // Reply型をインポート

// 返信を追加するフォームコンポーネント
export default function ReplyForm({
  onSubmit,
}: {
  onSubmit: (reply: Omit<Reply, "id">) => void; // onSubmitプロパティは、返信内容を親コンポーネントに送信するための関数
}) {
  // 各フィールドの入力値を管理するための状態変数
  const [from, setFrom] = useState(""); // 返信者の名前を管理
  const [content, setContent] = useState(""); // 返信の内容を管理

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ
    onSubmit({ from, content }); // 親コンポーネントに返信内容を送信
    // フォームの内容をリセット
    setFrom(""); // 返信者の名前を空にする
    setContent(""); // 返信内容を空にする
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {" "}
      {/* フォームのスタイルを設定 */}
      {/* 返信者の名前入力フィールド */}
      <div>
        <Label htmlFor="replyFrom">From</Label> {/* ラベルを設定 */}
        <Input
          id="replyFrom" // 入力フィールドのID
          value={from} // 現在の返信者の名前
          onChange={(e) => setFrom(e.target.value)} // 入力が変更されたときの処理
          required // このフィールドは必須
        />
      </div>
      {/* 返信内容入力フィールド */}
      <div>
        <Label htmlFor="replyContent">返信内容</Label> {/* ラベルを設定 */}
        <Textarea
          id="replyContent" // テキストエリアのID
          value={content} // 現在の返信内容
          onChange={(e) => setContent(e.target.value)} // 入力が変更されたときの処理
          required // このフィールドは必須
          className="min-h-[100px]" // 最小高さを設定
        />
      </div>
      {/* 送信ボタン */}
      <Button
        type="submit" // 送信ボタンとして指定
        className="bg-purple-600 hover:bg-purple-700 text-white" // ボタンのスタイル
      >
        返信を送信
      </Button>
    </form>
  );
}
