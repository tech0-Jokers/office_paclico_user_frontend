"use client"; // クライアントサイドでのレンダリングを指定します

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // DialogDescriptionをインポート
} from "@/components/ui/dialog"; // Dialogコンポーネント群をインポート
import ReplyForm from "./ReplyForm"; // 返信フォームコンポーネントをインポート
import { useState } from "react"; // ReactのuseStateフックをインポート
import { Message, Reply } from "@/components/types"; // 型定義をインポート

// 選択されたメッセージの詳細を表示するダイアログコンポーネント
export default function MessageDetailsDialog({
  message,
  onClose,
  onReply,
}: {
  message: Message; // メッセージのデータ
  onClose: () => void; // ダイアログを閉じる関数
  onReply: (reply: Omit<Reply, "id">) => void; // 返信を処理する関数
}) {
  // 選択されたメッセージを状態として保持します
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(
    message || null // 初期値として渡されたメッセージを設定
  );

  // 返信を追加する関数
  const addReply = (messageId: number, replyContent: Omit<Reply, "id">) => {
    const newReply: Reply = {
      id: Date.now(), // 数値型のIDを生成（UUIDなどを検討すること）
      ...replyContent, // 返信内容を展開
    };

    // 返信を追加するロジック
    if (selectedMessage) {
      setSelectedMessage({
        ...selectedMessage,
        replies: [...selectedMessage.replies, newReply], // 新しい返信を追加
      });
    }

    // 外部から渡されたonReplyコールバックを呼び出します
    onReply(newReply);
  };

  return (
    <Dialog
      open={!!selectedMessage} // selectedMessageが存在する場合、ダイアログを開く
      onOpenChange={() => {
        setSelectedMessage(null); // ダイアログを閉じたときに選択されたメッセージをリセット
        onClose(); // onCloseコールバックを呼び出す
      }}
    >
      <DialogContent
        className="bg-white max-h-[80vh] overflow-y-auto" // スタイルを適用
        aria-labelledby="dialog-title" // ダイアログタイトルのIDを指定
        aria-describedby="dialog-description" // 説明のIDを指定
      >
        <DialogHeader>
          <DialogTitle id="dialog-title">メッセージ詳細</DialogTitle>{" "}
          {/* ダイアログのタイトル */}
        </DialogHeader>
        <DialogDescription id="dialog-description">
          {" "}
          {/* 説明を追加 */}
          こちらは選択されたメッセージの詳細です。
        </DialogDescription>
        <div className="space-y-4">
          {" "}
          {/* 説明のためのコンテナ */}
          {selectedMessage && ( // 選択されたメッセージが存在する場合
            <>
              <p>
                <span className="font-semibold">To:</span> {selectedMessage.to}{" "}
                {/* 受取人 */}
              </p>
              <p>
                <span className="font-semibold">From:</span>{" "}
                {selectedMessage.from} {/* 送信者 */}
              </p>
              <p>
                <span className="font-semibold">メッセージ:</span>{" "}
                {selectedMessage.message} {/* メッセージ内容 */}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">返信</h3>
                {selectedMessage.replies.map(
                  (
                    reply // 返信リストを表示
                  ) => (
                    <div
                      key={reply.id}
                      className="bg-purple-50 p-2 rounded-md mb-2" // スタイルを適用
                    >
                      <p className="font-semibold text-sm text-purple-700">
                        {reply.from}:
                      </p>
                      <p className="text-purple-800">{reply.content}</p>
                    </div>
                  )
                )}
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
