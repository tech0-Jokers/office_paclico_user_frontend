"use client"; // クライアントサイドでのレンダリングを指定します

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ReplyForm from "@/components/ReplyForm"; // 返信フォームコンポーネントをインポート
import { useState, useEffect } from "react"; // Reactフックをインポート
import { Message, Reply } from "@/components/types"; // 型定義をインポート

// 型定義
interface User {
  user_id: number;
  user_name: string;
}

// 選択されたメッセージの詳細を表示するダイアログコンポーネント
export default function MessageDetailsDialog({
  message,
  organizationId,
  onClose,
  onReply,
}: {
  message: Message;
  organizationId: number;
  onClose: () => void;
  onReply: (reply: Omit<Reply, "id">) => void;
}) {
  const [users, setUsers] = useState<User[]>([]); // ユーザー情報を保持するステート
  const [error, setError] = useState<string | null>(null); // エラーメッセージを保持するステート
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(
    message || null
  ); // 選択されたメッセージを状態として保持

  // コンポーネントのマウント時にユーザー情報を取得
  useEffect(() => {
    if (organizationId) {
      fetchUsers(organizationId);
    }
  }, [organizationId]);

  // APIからユーザー情報を取得する関数
  const fetchUsers = async (organizationId: number) => {
    const requestUrl = `/api/user_information/${organizationId}`;

    try {
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(`ユーザー情報の取得に失敗しました: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("APIレスポンスが配列形式ではありません。");
      }

      setUsers(data);
      setError(null); // エラーが発生しなかった場合にリセット
    } catch (error) {
      console.error("ユーザー情報取得エラー:", error); // コンソールにログ
      setUsers([]); // エラー時は空のリストを設定
      setError("ユーザー情報の取得に失敗しました。");
    }
  };

  // 返信を追加する関数
  const addReply = (
    messageId: number,
    useName: string,
    replyContent: Omit<Reply, "id">
  ) => {
    const newReply: Reply = {
      id: Date.now(),
      ...replyContent,
    };

    if (selectedMessage) {
      setSelectedMessage({
        ...selectedMessage,
        replies: [...selectedMessage.replies, newReply],
      });
    }

    onReply(newReply);
  };

  return (
    <Dialog
      open={!!selectedMessage}
      onOpenChange={() => {
        setSelectedMessage(null);
        onClose();
      }}
    >
      <DialogContent
        className="bg-white max-h-[80vh] overflow-y-auto"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">メッセージ詳細</DialogTitle>

        {/* エラーメッセージの表示 */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <DialogDescription id="dialog-description">
          こちらは選択されたメッセージの詳細です。
        </DialogDescription>

        <div className="space-y-4">
          {selectedMessage && (
            <div>
              <p>
                <span className="font-semibold">To:</span>{" "}
                {selectedMessage.receiver_user_name}
              </p>
              <p>
                <span className="font-semibold">From:</span>{" "}
                {selectedMessage.sender_user_name}
              </p>
              <p>
                <span className="font-semibold">メッセージ:</span>{" "}
                {selectedMessage.message_content}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">返信</h3>
                {selectedMessage.reply_comments.map((reply) => (
                  <div
                    key={reply.reply_comment_id}
                    className="bg-purple-50 p-2 rounded-md mb-2"
                  >
                    <p className="font-semibold text-sm text-purple-700">
                      {reply.comment_user_id}:{reply.comment_user_name}:
                      {reply.message_content}:{reply.send_date?.toString()}
                    </p>
                  </div>
                ))}
              </div>

              <ReplyForm
                onSubmit={(reply) =>
                  addReply(
                    selectedMessage.message_id,
                    selectedMessage.sender_user_name,
                    reply
                  )
                }
                selectedUserName={selectedMessage.sender_user_name}
                userNames={users.map((user) => user.user_name)}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
