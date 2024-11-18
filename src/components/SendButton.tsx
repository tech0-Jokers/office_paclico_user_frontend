// 必要なライブラリやコンポーネントをインポート
import React, { useState } from "react";
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
const SendButton: React.FC<SendButtonProps> = ({ onClick, addMessage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="flex justify-start mb-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              onClick();
              handleOpen();
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            お菓子とお礼のメッセージを送る
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新しいメッセージ</DialogTitle>
          </DialogHeader>
          <NewMessageForm onSubmit={addMessage} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// このコンポーネントをエクスポートして他のファイルで使えるようにする
export default SendButton;
