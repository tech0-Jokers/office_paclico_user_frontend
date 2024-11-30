// 必要なライブラリやコンポーネントをインポート
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewMessageForm from "@/components/NewMessageForm"; // 新しいメッセージフォームをインポート

// プロパティの型を定義
interface SendButtonProps {
  onClick: () => void;
  organizationId: number; // 追加
}

// 送信ボタンコンポーネント
const SendButton: React.FC<SendButtonProps> = ({ onClick, organizationId }) => {
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
          <DialogTitle>新しいメッセージ</DialogTitle>
          <DialogDescription>必要な情報を入力してください。</DialogDescription>
          <NewMessageForm
            onSubmit={() => {
              // handle submit logic here
            }}
            onClose={handleClose}
            organizationId={organizationId}
          />
          {/* 追加 */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// このコンポーネントをエクスポートして他のファイルで使えるようにする
export default SendButton;
