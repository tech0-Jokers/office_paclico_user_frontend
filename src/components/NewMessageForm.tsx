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
import { Chocolate } from "@/components/types";

// 新しいメッセージを作成するフォームコンポーネント
export default function NewMessageForm({
  onSubmit,
}: {
  onSubmit: (message: Omit<Message, "id" | "likes" | "replies">) => void; // メッセージ送信時のコールバック
}) {
  // 各フィールドの入力値を管理する状態変数
  const [to, setTo] = useState(""); // 送信先
  const [from, setFrom] = useState(""); // 送信元
  const [message, setMessage] = useState(predefinedMessages[0]); // メッセージ内容
  const [treat, setTreat] = useState(""); // お菓子の種類
  const [imageUrl, setImageUrl] = useState(""); // 画像URL
  const [messageInputType, setMessageInputType] = useState<"select" | "custom">(
    "select"
  ); // メッセージ入力方法の選択
  const [chocolates, setChocolates] = useState<Chocolate[]>([]); // チョコレートのデータを格納する状態変数

  // コンポーネントのマウント時にチョコレートデータを取得
  useEffect(() => {
    const fetchChocolates = async () => {
      const response = await fetch("/api/chocolate"); // APIからデータを取得
      const data = await response.json(); // JSON形式にパース
      setChocolates(data.chocolates); // 状態を更新
    };

    fetchChocolates(); // データ取得関数を呼び出し
  }, []);

  // お菓子選択時の処理
  const handleTreatChange = (value: string) => {
    setTreat(value); // お菓子を選択
    const selectedChocolate = chocolates.find(
      (choco) => choco.Product_Name === value
    );
    setImageUrl(selectedChocolate ? selectedChocolate.Image_Url : ""); // 選択したお菓子の画像URLをセット
  };

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ
    onSubmit({ to, from, message, treat, imageUrl }); // 親コンポーネントにメッセージ内容を送信
    // フォーム内容をリセット
    setTo("");
    setFrom("");
    setMessage(messageInputType === "select" ? predefinedMessages[0] : "");
    setTreat("");
    setImageUrl("");
    setMessageInputType("select");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* お菓子の種類選択 */}
      <div>
        <Label htmlFor="treat">お菓子</Label>
        <Select value={treat} onValueChange={handleTreatChange} required>
          <SelectTrigger>
            <SelectValue placeholder="お菓子を選択" />
          </SelectTrigger>
          <SelectContent>
            {chocolates.map((chocolate) => (
              <SelectItem key={chocolate.Index} value={chocolate.Product_Name}>
                {chocolate.Product_Name}
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
      <div>
        <Label htmlFor="to">To</Label>
        <Input
          id="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
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
