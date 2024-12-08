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

// ユーザー情報の型定義
interface User {
  user_id: number; // ユーザーID
  user_name: string; // ユーザー名
}

// 選択されたメッセージの詳細を表示するダイアログコンポーネント
export default function MessageDetailsDialog({
  message,
  organizationId,
  onClose,
  onReply,
}: {
  message: Message; // メッセージデータ
  organizationId: number; // 組織ID
  onClose: () => void; // ダイアログを閉じる関数
  onReply: (reply: Omit<Reply, "id">) => void; // 返信を親コンポーネントに通知する関数
}) {
  // ステート（状態管理）
  const [users, setUsers] = useState<User[]>([]); // ユーザー情報を保持するステート
  const [error, setError] = useState<string | null>(null); // エラーメッセージを保持するステート
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(
    message || null
  ); // 選択されたメッセージを状態として保持

  // 初回レンダリング時にユーザー情報を取得
  useEffect(() => {
    if (organizationId) {
      fetchUsers(organizationId); // 組織IDを使ってユーザー情報を取得
    }
  }, [organizationId]);

  // APIからユーザー情報を取得する関数
  const fetchUsers = async (organizationId: number) => {
    const requestUrl = `/api/user_information/${organizationId}`; // APIエンドポイント

    try {
      const response = await fetch(requestUrl); // APIを呼び出し

      if (!response.ok) {
        throw new Error(`ユーザー情報の取得に失敗しました: ${response.status}`);
      }

      const data = await response.json(); // レスポンスをJSONとしてパース

      if (!Array.isArray(data)) {
        throw new Error("APIレスポンスが配列形式ではありません。");
      }

      setUsers(data); // ユーザー情報をステートに保存
      setError(null); // エラーをクリア
    } catch (error) {
      console.error("ユーザー情報取得エラー:", error); // エラーメッセージをコンソールに表示
      setUsers([]); // ユーザーリストを空にリセット
      setError("ユーザー情報の取得に失敗しました。");
    }
  };

  // 返信をエンドポイントに送信する関数
  const sendReplyToBackend = async (replyContent: {
    message_id: number;
    comment_user_id: number;
    comment_user_name: string;
    message_content: string;
    from_name: string;
    from_name_input: string;
  }) => {
    const requestUrl = `/api/add_comments`; // 返信を送るAPIエンドポイント
    try {
      const response = await fetch(requestUrl, {
        method: "POST", // POSTメソッドで送信
        headers: {
          "Content-Type": "application/json", // JSON形式でデータを送信
        },
        body: JSON.stringify(replyContent), // 送信するデータをJSON形式に変換
      });

      if (!response.ok) {
        throw new Error("返信メッセージの送信に失敗しました");
      }

      const result = await response.json(); // サーバーのレスポンスをパース
      return result.comment; // 新しく追加された返信を返す
    } catch (error) {
      console.error("サーバーエラー:", error); // エラーをコンソールに表示
      throw error; // エラーを呼び出し元に投げる
    }
  };

  // 返信を追加する関数
  const addReply = async (
    messageId: number,
    userName: string,
    replyContent: Omit<Reply, "id" | "send_date"> & { from_name: string }
  ) => {
    console.log("全ユーザー:", users);
    console.log("選択されたユーザー名:", userName);

    try {
      // `from_name`を基にユーザーIDを検索
      const matchedUser = users.find(
        (user) => user.user_name === replyContent.from_name
      );

      // サーバーに送信するデータを構築
      const replyData = {
        message_id: messageId, // メッセージID
        comment_user_id: matchedUser?.user_id || 0, // 一致するユーザーID
        comment_user_name: matchedUser?.user_name || replyContent.from_name, // ユーザー名
        comment_user_name_manual_input: replyContent.from_name_input, // 手動入力されたユーザー名
        message_content: replyContent.content, // メッセージ内容
        from_name: replyContent.from_name, // 追加: `from_name`
        from_name_input: replyContent.from_name_input, // 追加: `from_name_input`
      };

      console.log("送信データ:", replyData); // デバッグ用に送信データを表示

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
      open={!!selectedMessage} // ダイアログを開く条件
      onOpenChange={() => {
        setSelectedMessage(null); // メッセージ選択をクリア
        onClose(); // ダイアログを閉じる
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
                      <th className="border border-purple-200 px-4 py-2">
                        グループ
                      </th>
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
                          {reply.comment_user_name}
                        </td>
                        <td className="border border-purple-200 px-4 py-2 text-purple-700">
                          {reply.comment_user_name_manual_input}
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
