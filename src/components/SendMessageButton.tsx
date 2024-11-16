// Reactをインポート（Reactコンポーネントを使用するために必要）
import React from "react";

// 新しいメッセージフォームコンポーネントをインポート
import NewMessageForm from "@/components/NewMessageForm";

// UIライブラリからButtonコンポーネントをインポート
import { Button } from "@/components/ui/button";

// Dialog関連のコンポーネントをUIライブラリからインポート
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// SendButtonコンポーネントのProps（プロパティ）の型を定義
interface SendButtonProps {
  onClick: () => void; // ボタンがクリックされたときに呼び出される関数
}

// 新しいメッセージを追加するための関数型を定義（例としてMessage型を仮定）
interface Message {
  id: number; // メッセージの一意のID
  likes: number; // メッセージの「いいね」数
  replies: Message[]; // メッセージへの返信
  [key: string]: any; // その他のプロパティ（型の柔軟性を確保）
}

// メインのアプリケーションコンポーネント
export default function SendMessageApp() {
  // 名前を変更
  // useStateを使用してメッセージの状態を管理（未定義として仮定）
  const [messages, setMessages] = React.useState<Message[]>([]);

  // 新しいメッセージを追加する関数
  const addMessage = (
    newMessage: Omit<Message, "id" | "likes" | "replies">
  ) => {
    // 現在のメッセージリストに新しいメッセージを追加
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        ...newMessage, // 新しいメッセージの内容を展開
        id: prevMessages.length + 1, // IDはリストの長さ+1で一意性を確保
        likes: 0, // 初期値として「いいね」は0
        replies: [], // 返信は空の配列で初期化
      },
    ]);
  };

  // 送信ボタンコンポーネント
  const SendButton: React.FC<SendButtonProps> = ({ onClick }) => {
    return (
      <div className="flex justify-start mb-4">
        {/* モーダルダイアログを作成 */}
        <Dialog>
          {/* ダイアログを開くためのトリガーボタン */}
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
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
            {/* フォームが送信されるとaddMessage関数が呼び出される */}
            <NewMessageForm onSubmit={addMessage} />
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // 必要なコンポーネントやロジックをエクスポート
  return (
    <SendButton onClick={() => console.log("ボタンがクリックされました")} />
  );
}
