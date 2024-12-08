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

      setUsers(data); // ユーザー情報をセット
      setError(null); // エラーが発生しなかった場合にリセット
    } catch (error) {
      console.error("ユーザー情報取得エラー:", error); // コンソールにログ
      setUsers([]); // エラー時は空のリストを設定
      setError("ユーザー情報の取得に失敗しました。");
    }
  };

  // 返信をエンドポイントに送る関数
  const sendReplyToBackend = async (replyContent: {
    message_id: number;
    comment_user_id: number;
    message_content: string;
    comment_user_name_manual_input: string;
  }) => {
    const requestUrl = `/api/add_comments`;
    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(replyContent),
      });

      if (!response.ok) {
        throw new Error("返信メッセージの送信に失敗しました");
      }

      const result = await response.json();
      return result.comment;
    } catch (error) {
      console.error("サーバーエラー:", error);
      throw error;
    }
  };

  // 返信を追加する関数
  const addReply = async (
    messageId: number,
    userName: string,
    replyContent: Omit<Reply, "id" | "send_date">
  ) => {
    try {
      // サーバーに送信するデータを構築
      const replyData = {
        message_id: messageId,
        comment_user_id:
          users.find((user) => user.user_name === userName)?.user_id || 0, // 選択されたユーザーのIDを取得
        comment_user_name_manual_input: replyContent.from_name_input, // ユーザー名
        message_content: replyContent.content, // フォームからの返信内容
      };

      // サーバーに送信
      const newReply = await sendReplyToBackend(replyData);

      // ローカルステートに反映
      if (selectedMessage) {
        setSelectedMessage({
          ...selectedMessage,
          reply_comments: [...selectedMessage.reply_comments, newReply],
        });
      }

      // 親コンポーネントに通知
      onReply(newReply);
    } catch (error) {
      console.error("返信の追加に失敗しました:", error);
      setError("返信の送信に失敗しました。再度お試しください。");
    }
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

        {/* メッセージ詳細の表示 */}
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
                <h3 className="font-semibold mb-2">返信メッセージ</h3>
                <table className="table-auto w-full border-collapse border border-purple-200 text-sm">
                  <thead>
                    <tr className="bg-purple-100">
                      <th className="border border-purple-200 px-4 py-2">ID</th>
                      <th className="border border-purple-200 px-4 py-2">
                        名前
                      </th>
                      <th className="border border-purple-200 px-4 py-2">
                        内容
                      </th>
                      <th className="border border-purple-200 px-4 py-2">
                        送信日時
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMessage.reply_comments.map((reply) => (
                      <tr key={reply.reply_comment_id}>
                        <td className="border border-purple-200 px-4 py-2 text-purple-700">
                          {reply.comment_user_id}
                        </td>
                        <td className="border border-purple-200 px-4 py-2 text-purple-700">
                          {reply.comment_user_name}
                        </td>
                        <td className="border border-purple-200 px-4 py-2 text-purple-700">
                          {reply.message_content}
                        </td>
                        <td className="border border-purple-200 px-4 py-2 text-purple-700">
                          {reply.send_date
                            ? new Date(reply.send_date).toLocaleDateString(
                                "ja-JP",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">返信を送る</h3>
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
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
