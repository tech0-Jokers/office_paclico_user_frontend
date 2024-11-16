// 必要なライブラリやコンポーネントをインポート
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewMessageForm from "@/components/NewMessageForm"; // 新しいメッセージフォームをインポート
import { Message } from "@/components/types"; // 型定義をインポート

// プロパティの型を定義
interface SendButtonProps {
  onClick: () => void;
  addMessage: (newMessage: Omit<Message, "id" | "likes" | "replies">) => void;
}

// 送信ボタンコンポーネント
const SendButton: React.FC<SendButtonProps> = ({ onClick, addMessage }) => (
  <div className="flex justify-start mb-4">
    {/* モーダルダイアログを作成 */}
    <Dialog>
      {/* ダイアログを開くためのトリガーボタン */}
      <DialogTrigger asChild>
        <Button
          onClick={onClick}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          お菓子とお礼のメッセージを送る
        </Button>
      </DialogTrigger>

      {/* ダイアログの中身 */}
      <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
        {/* ダイアログのヘッダー */}
        <DialogHeader>
          <DialogTitle>新しいメッセージ</DialogTitle>
        </DialogHeader>

        {/* 新しいメッセージフォーム */}
        <NewMessageForm onSubmit={addMessage} />
      </DialogContent>
    </Dialog>
  </div>
);

// このコンポーネントをエクスポートして他のファイルで使えるようにする
export default SendButton;
