// MessageDetailsDialog.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import ReplyForm from "./ReplyForm";
import { useState } from "react";
import { Message, Reply } from "../types";

// 選択されたメッセージの詳細を表示するダイアログ
export default function MessageDetailsDialog({
  message,
  onClose,
  onReply,
}: {
  message: Message;
  onClose: () => void;
  onReply: (reply: Omit<Reply, "id">) => void;
}) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(
    message
  );

  // 返信を追加する関数
  const addReply = (messageId: string, replyContent: Omit<Reply, "id">) => {
    const newReply: Reply = {
      id: String(Date.now()), // 一意のIDを生成
      ...replyContent,
    };
    // 返信追加
    if (selectedMessage) {
      setSelectedMessage({
        ...selectedMessage,
        replies: [...selectedMessage.replies, newReply],
      });
    }
    onReply(newReply); // 外部から渡されたonReplyコールバックを呼び出し
  };

  return (
    <Dialog
      open={!!selectedMessage}
      onOpenChange={() => {
        setSelectedMessage(null);
        onClose();
      }}
    >
      <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>メッセージ詳細</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {selectedMessage && (
            <>
              <p>
                <span className="font-semibold">To:</span> {selectedMessage.to}
              </p>
              <p>
                <span className="font-semibold">From:</span>{" "}
                {selectedMessage.from}
              </p>
              <p>
                <span className="font-semibold">メッセージ:</span>{" "}
                {selectedMessage.message}
              </p>
              <div>
                <p className="font-semibold mb-2">お菓子:</p>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">返信</h3>
                {selectedMessage.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-purple-50 p-2 rounded-md mb-2"
                  >
                    <p className="font-semibold text-sm text-purple-700">
                      {reply.from}:
                    </p>
                    <p className="text-purple-800">{reply.content}</p>
                  </div>
                ))}
              </div>
              <ReplyForm
                onSubmit={(reply) => addReply(selectedMessage.id, reply)}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
