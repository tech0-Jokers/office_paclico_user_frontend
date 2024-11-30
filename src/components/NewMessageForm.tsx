"use client"; // クライアントサイドでのレンダリングを指定します

import Image from "next/image"; // 画像コンポーネントをインポート
import { useState, useEffect } from "react"; // useStateとuseEffectフックをインポート
import { Button } from "@/components/ui/button"; // ボタンコンポーネントをインポート
import { Input } from "@/components/ui/input"; // 入力コンポーネントをインポート
import { Label } from "@/components/ui/label"; // ラベルコンポーネントをインポート
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // セレクトコンポーネントをインポート
import { Textarea } from "@/components/ui/textarea"; // テキストエリアコンポーネントをインポート
import { predefinedMessages } from "@/components/constants"; // 定義済みメッセージをインポート
import { Message } from "@/components/types"; // Message型をインポート
import { Products } from "@/components/types";

// 型定義
interface User {
  user_id: number; // ユーザーID
  user_name: string; // ユーザー名
}

// エラーメッセージ表示用のコンポーネント
const ErrorMessage = ({ error }: { error: string | null }) => {
  if (!error) return null; // エラーがない場合は何も表示しない
  return <div className="error-message text-red-600 p-2">{error}</div>; // エラーがある場合は赤いテキストで表示
};

// メッセージ送信フォームのコンポーネント
export default function NewMessageForm({
  onSubmit,
  onClose,
}: {
  onSubmit: (message: Omit<Message, "id" | "likes" | "replies">) => void; // 親コンポーネントから渡される送信処理のコールバック
  onClose: () => void; // 親コンポーネントから渡されるモーダル閉じる処理のコールバック
}) {
  // 各フィールドの入力値を管理する状態変数
  const [to, setTo] = useState(""); // 送信先
  const [from, setFrom] = useState(""); // 送信元
  const [message, setMessage] = useState(predefinedMessages[0]); // メッセージ内容
  const [treat, setTreat] = useState(""); // お菓子の種類
  const [users, setUsers] = useState<User[]>([]); // ユーザーリスト
  const [selectedUser, setSelectedUser] = useState(""); // 選択されたユーザー
  const [imageUrl, setImageUrl] = useState(""); // 画像URL
  const [messageInputType, setMessageInputType] = useState<"select" | "custom">(
    "select"
  ); // メッセージ入力方法の選択
  const [products, setProducts] = useState<Products[]>([]); // チョコレートのデータを格納する状態変数
  const [error, setError] = useState<string | null>(null); // エラーメッセージを保持するステート

  // 組織IDを定義します（仮に1を設定しています。実際の値に置き換えてください）
  const organizationId = 1;

  // コンポーネントのマウント時にデータを取得します。
  useEffect(() => {
    if (organizationId) {
      fetchProducts(organizationId); // データ取得関数を呼び出す
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

  // APIからお菓子データを取得する非同期関数
  const fetchProducts = async (organizationId: number) => {
    const requestUrl = `/api/products/${organizationId}`; // APIのエンドポイントを作成

    try {
      const response = await fetch(requestUrl); // APIリクエストを送信

      // レスポンスがエラーの場合は例外をスロー
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "指定された組織のお菓子データが見つかりませんでした。"
          );
        } else if (response.status === 403) {
          throw new Error("データへのアクセス権限がありません。");
        } else {
          throw new Error(
            `お菓子データの取得に失敗しました: ${response.status}`
          );
        }
      }

      const data = await response.json(); // レスポンスデータをJSON形式で取得
      setProducts(data); // 取得したデータをステートにセット
      setError(null); // エラーメッセージをクリア
    } catch (error) {
      console.error("データ取得中にエラー:", error); // コンソールにエラーを表示
      setError("データの取得に失敗しました。後でもう一度試してください。"); // ユーザーにエラーメッセージを表示
    }
  };

  // お菓子を選択したときの処理
  const handleTreatChange = (value: string) => {
    setTreat(value); // 選択したお菓子の名前を保存
    const selectedProduct = products.find((p) => p.product_name === value); // お菓子データから選択肢を検索
    setImageUrl(selectedProduct?.product_image_url || ""); // 画像URLを設定（見つからない場合は空）
  };

  // ユーザーを選択したときの処理
  const handleUserSelect = (username: string) => {
    const selectedUser = users.find((user) => user.user_name === username);
    setSelectedUser(username); // 選択されたユーザー名を保存
    setTo(username); // `to` フィールドにも設定
  };

  // フォームのリセット処理
  const resetForm = () => {
    setTo("");
    setFrom("");
    setMessage(predefinedMessages[0]);
    setTreat("");
    setImageUrl("");
    setMessageInputType("select");
  };

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信を無効化
    try {
      onSubmit({ to, from, message, treat, imageUrl }); // 親コンポーネントにデータを送信
      resetForm(); // フォームをリセット
      onClose(); // モーダルを閉じる
    } catch (error) {
      console.error("送信エラー:", error);
      setError(error instanceof Error ? error.message : "送信に失敗しました"); // エラーメッセージを設定
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* エラーメッセージの表示 */}
      <ErrorMessage error={error} />
      {/* お菓子の種類選択 */}
      <div>
        {error && <div className="error-message text-red-600 p-2">{error}</div>}
        {/* 既存のフォーム要素 */}
      </div>
      <div>
        <Label htmlFor="treat">お菓子</Label>
        <Select value={treat} onValueChange={handleTreatChange} required>
          <SelectTrigger>
            <SelectValue placeholder="お菓子を選択" />
          </SelectTrigger>
          <SelectContent>
            {products.map((products) => (
              <SelectItem
                key={products.product_id}
                value={products.product_id.toString()}
              >
                {products.product_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* 選択した画像のプレビュー */}
      {imageUrl && (
        <div className="aspect-video relative">
          <Image
            src={imageUrl}
            alt="Selected treat image"
            layout="fill" // Next.jsのImageコンポーネントの場合、`fill`レイアウトを指定します。
            className="object-contain rounded-md"
          />
        </div>
      )}

      {/* 送信先フィールド */}
      {/* ユーザー選択セレクトボックス */}
      <div>
        <Label htmlFor="userSelect">送信先ユーザー</Label>
        <Select value={selectedUser} onValueChange={handleUserSelect} required>
          <SelectTrigger>
            <SelectValue placeholder="ユーザーを選択" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.user_id} value={user.user_name}>
                {user.user_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 送信元フィールド */}
      <div>
        <Label htmlFor="from">From</Label>
        <Input
          id="from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
      </div>
      {/* メッセージ入力方法の選択 */}
      <div>
        <Label>メッセージ入力方法</Label>
        <div className="flex space-x-2 mt-1">
          <Button
            type="button"
            variant={messageInputType === "select" ? "default" : "outline"}
            onClick={() => setMessageInputType("select")}
          >
            定型文から選択
          </Button>
          <Button
            type="button"
            variant={messageInputType === "custom" ? "default" : "outline"}
            onClick={() => setMessageInputType("custom")}
          >
            自由に入力
          </Button>
        </div>
      </div>
      {/* メッセージ内容の入力（定型文または自由入力） */}
      {messageInputType === "select" ? (
        <div>
          <Label htmlFor="message">メッセージ</Label>
          <Select value={message} onValueChange={setMessage} required>
            <SelectTrigger>
              <SelectValue placeholder="メッセージを選択" />
            </SelectTrigger>
            <SelectContent>
              {predefinedMessages.map((msg, index) => (
                <SelectItem key={index} value={msg}>
                  {msg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div>
          <Label htmlFor="customMessage">カスタムメッセージ</Label>
          <Textarea
            id="customMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="min-h-[100px]"
          />
        </div>
      )}

      {/* 送信ボタン */}
      <Button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        送信
      </Button>
    </form>
  );
}
