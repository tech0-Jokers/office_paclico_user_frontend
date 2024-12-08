"use client"; // クライアントサイドでのレンダリングを指定します

import { useState } from "react"; // ReactのuseStateフックをインポート
import { Button } from "@/components/ui/button"; // ボタンコンポーネントをインポート
import { Label } from "@/components/ui/label"; // ラベルコンポーネントをインポート
import { Textarea } from "@/components/ui/textarea"; // テキストエリアコンポーネントをインポーネ���ト
import { Reply } from "@/components/types"; // Reply型をインポート

// 返信を追加するフォーム
export default function ReplyForm({
  onSubmit,
  selectedUserName,
  userNames, // 追加: ユーザー名のリスト
}: {
  onSubmit: (reply: Omit<Reply, "id">) => void; // onSubmitプロパティは、返信内容を親コンポーネントに送信するための関数
  selectedUserName: string; // 選択されたユーザー名
  userNames: string[]; // 追加: ユーザー名のリスト
}) {
  // 各フィールドの入力値を管理するための状態変数
  const [from_name, setFrom_name] = useState(selectedUserName); // 返信者の名前を管理
  const [from_name_input, setFrom_name_input] = useState(""); // 返信者の名前を管理
  const [content, setContent] = useState(""); // 返信の内容を管理

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ
    onSubmit({ from_name, from_name_input, content }); // 親コンポーネントに返信内容を送信
    setFrom_name(""); // 返信者の名前を空にする
    setContent(""); // 返信内容を空にする
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 返信者の名前入力フィールド */}
      <div>
        <Label htmlFor="replyFrom">あなたのグループを選んでください</Label>{" "}
        {/* ラベルを設定 */}
        <select
          id="replyFrom" // プルダウンのID
          value={from_name} // 現在の返信者の名前
          onChange={(e) => setFrom_name(e.target.value)} // 選択が変更されたときの処理
        >
          {userNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {/* メッセージの送り主の名前を入力する */}
      <div>
        <Label htmlFor="from_name_input">あなたの名前を入力してください</Label>
        <Textarea
          id="from_name_input"
          value={from_name_input}
          onChange={(e) => setFrom_name_input(e.target.value)}
          rows={1}
          style={{ height: "auto", minHeight: "1em" }}
        />
      </div>
      {/* 返信内容入力フィールド */}
      <div>
        <Label htmlFor="replyContent">Content</Label> {/* ラベルを設定 */}
        <Textarea
          id="replyContent" // テキストエリアのID
          value={content} // 現在の返信内容
          onChange={(e) => setContent(e.target.value)} // 入力が変更されたときの処理
        />
      </div>
      <Button type="submit">Submit</Button> {/* 送信ボタン */}
    </form>
  );
}
