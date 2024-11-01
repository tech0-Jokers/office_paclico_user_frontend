// MessageDetailsDialog.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // DialogTrigger は未使用のため削除しました
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
  // selectedMessageは、ユーザーが選択したメッセージを保持するための状態です
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
              <div className="aspect-video relative">
                {/* selectedMessageの画像URLをImageコンポーネントで表示します */}
                <Image
                  src={selectedMessage.imageUrl}
                  alt="Message image"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
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
                {/* お菓子の情報を表示する画像 */}
                <p className="font-semibold mb-2">お菓子:</p>
                <Image
                  src={`/placeholder.svg?height=200&width=200&text=${selectedMessage.treat}`}
                  alt={selectedMessage.treat}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
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
              {/* ReplyFormコンポーネントを使用して新しい返信を追加します */}
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
