"use client"; // クライアントサイドでのレンダリングを指定します

import {
  Dialog,
  DialogContent,
  DialogTitle, // DialogTitleをインポート
  DialogDescription, // DialogDescriptionをインポート
} from "@/components/ui/dialog"; // Dialogコンポーネント群をインポート
import ReplyForm from "@/components/ReplyForm"; // 返信フォームコンポーネントをインポート
import { useState, useEffect } from "react"; // ReactのuseStateフックをインポート
import { Message, Reply } from "@/components/types"; // 型定義をインポート

// 型定義
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
  message: Message; // メッセージのデータ
  organizationId: number; // 組織ID
  onClose: () => void; // ダイアログを閉じる関数
  onReply: (reply: Omit<Reply, "id">) => void; // 返信を処理する関数
}) {
  const [error, setError] = useState<string | null>(null); // エラーメッセージを保持するステート
  const [users, setUsers] = useState<User[]>([]); // ユーザー情報を保持するステート
  // 選択されたメッセージを状態として保持します
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(
    message || null // 初期値として渡されたメッセージを設定
  );

  // コンポーネントのマウント時にデータを取得します。
  useEffect(() => {
    if (organizationId) {
      fetchUsers(organizationId); // ユーザー情報を取得
    }
  }, [organizationId]); // organizationIdが変化するたびに再実行

  // APIからユーザー情報を取得する関数
  const fetchUsers = async (organizationId: number) => {
    const requestUrl = `/api/user_information/${organizationId}`;

    try {
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(`ユーザー情報の取得に失敗しました: ${response.status}`);
      }

      const data = await response.json();

      // 配列形式であることをチェック
      if (!Array.isArray(data)) {
        throw new Error("APIレスポンスが配列形式ではありません。");
      }

      setUsers(data); // 正常なデータをセット
      setError(null);
    } catch (error) {
      console.error("ユーザー情報取得エラー:", error);
      setUsers([]); // エラー時は空配列を設定
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
        <DialogTitle id="dialog-title">メッセージ詳細</DialogTitle>
        {/* ダイアログのタイトルを表示 */}

        <DialogDescription id="dialog-description">
          こちらは選択されたメッセージの詳細です。
          {/* ダイアログの説明を追加 */}
        </DialogDescription>

        <div className="space-y-4">
          {selectedMessage && ( // 選択されたメッセージが存在する場合
            <div>
              <p>
                <span className="font-semibold">To:</span>{" "}
                {selectedMessage.receiver_user_name} {/* 受取人の表示 */}
              </p>
              <p>
                <span className="font-semibold">From:</span>{" "}
                {selectedMessage.sender_user_name} {/* 送信者の表示 */}
              </p>
              <p>
                <span className="font-semibold">メッセージ:</span>{" "}
                {selectedMessage.message_content} {/* メッセージ内容の表示 */}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">返信</h3>
                {selectedMessage.reply_comments.map((reply) => (
                  <div
                    key={reply.reply_comment_id}
                    className="bg-purple-50 p-2 rounded-md mb-2" // スタイルを適用
                  >
                    <p className="font-semibold text-sm text-purple-700">
                      {reply.comment_user_id}:{reply.comment_user_name}:
                      {reply.message_content}:{reply.send_date?.toString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* ReplyFormコンポーネントを使用して新しい返信を追加します */}
              <ReplyForm
                onSubmit={(reply) =>
                  addReply(
                    selectedMessage.message_id,
                    selectedMessage.sender_user_name, // 送信者の名前を渡す
                    reply
                  )
                } // 送信者の名前を渡す
                selectedUserName={selectedMessage.sender_user_name} // 送信者の名前を渡す
                userNames={users.map((user) => user.user_name)} // ユーザー名のリストを渡す
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
