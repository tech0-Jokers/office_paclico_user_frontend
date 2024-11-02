"use client"; // クライアントサイドでのレンダリングを指定します

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // DialogTrigger は未使用のため削除しました
import ReplyForm from "./ReplyForm"; // 返信フォームコンポーネントをインポート
import { useState } from "react"; // ReactのuseStateフックをインポート
import { Message, Reply } from "@/components/types"; // 型定義をインポート

// 選択されたメッセージの詳細を表示するダイアログ
export default function MessageDetailsDialog({
  message,
  onClose,
  onReply,
}: {
  message: Message; // メッセージのデータ
  onClose: () => void; // ダイアログを閉じる関数
  onReply: (reply: Omit<Reply, "id">) => void; // 返信を処理する関数
}) {
  // selectedMessageは、ユーザーが選択したメッセージを保持するための状態です
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(
    message // 初期値として渡されたメッセージを設定
  );

  // 返信を追加する関数
  const addReply = (messageId: number, replyContent: Omit<Reply, "id">) => {
    const newReply: Reply = {
      id: Date.now(), // 数値型のIDを生成
      ...replyContent, // 返信内容を展開
    };
    // 返信を追加するロジック
    if (selectedMessage) {
      setSelectedMessage({
        ...selectedMessage,
        replies: [...selectedMessage.replies, newReply], // 新しい返信を追加
      });
    }
    onReply(newReply); // 外部から渡されたonReplyコールバックを呼び出し
  };

  return (
    <Dialog
      open={!!selectedMessage} // selectedMessageが存在する場合、ダイアログを開く
      onOpenChange={() => {
        setSelectedMessage(null); // ダイアログを閉じたときに選択されたメッセージをリセット
        onClose(); // onCloseコールバックを呼び出す
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
                onSubmit={(reply) => addReply(selectedMessage.id, reply)} // IDを直接渡す
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
