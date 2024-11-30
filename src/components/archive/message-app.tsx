"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

type Reply = {
  id: number;
  from: string;
  content: string;
};

type Message = {
  id: number;
  to: string;
  from: string;
  message: string;
  treat: string;
  likes: number;
  replies: Reply[];
  imageUrl: string;
};

const predefinedMessages = [
  "ありがとうございます！",
  "頑張ってください！",
  "助かりました！",
  "お疲れ様です！",
  "素晴らしい仕事です！",
];

const predefinedImages = [
  "/placeholder.svg?height=200&width=200&text=Image1",
  "/placeholder.svg?height=200&width=200&text=Image2",
  "/placeholder.svg?height=200&width=200&text=Image3",
];

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      to: "田中さん",
      from: "鈴木",
      message: "ありがとうございます！",
      treat: "チョコレート",
      likes: 0,
      replies: [],
      imageUrl: predefinedImages[0],
    },
    {
      id: 2,
      to: "佐藤さん",
      from: "高橋",
      message: "頑張ってください！",
      treat: "クッキー",
      likes: 0,
      replies: [],
      imageUrl: predefinedImages[1],
    },
  ]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const addMessage = (
    newMessage: Omit<Message, "id" | "likes" | "replies">
  ) => {
    setMessages([
      ...messages,
      { ...newMessage, id: messages.length + 1, likes: 0, replies: [] },
    ]);
  };

  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
  };

  const addReply = (messageId: number, reply: Omit<Reply, "id">) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              replies: [
                ...msg.replies,
                { ...reply, id: msg.replies.length + 1 },
              ],
            }
          : msg
      )
    );
    setSelectedMessage((prev) =>
      prev && prev.id === messageId
        ? {
            ...prev,
            replies: [
              ...prev.replies,
              { ...reply, id: prev.replies.length + 1 },
            ],
          }
        : prev
    );
  };

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">
        メッセージアプリ
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {messages.map((message) => (
          <Card
            key={message.id}
            className="bg-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedMessage(message)}
          >
            <CardContent className="p-4">
              <div className="aspect-video relative mb-2">
                <Image
                  src={message.imageUrl}
                  alt="Message image"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <p className="font-semibold text-purple-700">To: {message.to}</p>
              <p className="text-purple-600">From: {message.from}</p>
              <p className="text-purple-800 mt-2">{message.message}</p>
              <div className="mt-2 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-purple-600 border-purple-600 flex items-center gap-1"
                  onClick={(e) => handleLike(e, message.id)}
                >
                  👍 いいね{" "}
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 rounded-md text-purple-800 font-semibold">
                    {message.likes}
                  </span>
                </Button>
                <span className="text-sm text-purple-600">
                  {message.replies.length} 件の返信
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            新しいメッセージを作成
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新しいメッセージ</DialogTitle>
          </DialogHeader>
          <NewMessageForm onSubmit={addMessage} />
        </DialogContent>
      </Dialog>
      {selectedMessage && (
        <Dialog
          open={!!selectedMessage}
          onOpenChange={() => setSelectedMessage(null)}
        >
          <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>メッセージ詳細</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video relative">
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
              <ReplyForm
                onSubmit={(reply) => addReply(selectedMessage.id, reply)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function NewMessageForm({
  onSubmit,
}: {
  onSubmit: (message: Omit<Message, "id" | "likes" | "replies">) => void;
}) {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState(predefinedMessages[0]);
  const [treat, setTreat] = useState("");
  const [imageUrl, setImageUrl] = useState(predefinedImages[0]);
  const [messageInputType, setMessageInputType] = useState<"select" | "custom">(
    "select"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ to, from, message, treat, imageUrl });
    setTo("");
    setFrom("");
    setMessage(messageInputType === "select" ? predefinedMessages[0] : "");
    setTreat("");
    setImageUrl(predefinedImages[0]);
    setMessageInputType("select");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="to">To</Label>
        <Input
          id="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="from">From</Label>
        <Input
          id="from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
      </div>
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
      <div>
        <Label htmlFor="treat">お菓子</Label>
        <Select value={treat} onValueChange={setTreat} required>
          <SelectTrigger>
            <SelectValue placeholder="お菓子を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="チョコレート">チョコレート</SelectItem>
            <SelectItem value="クッキー">クッキー</SelectItem>
            <SelectItem value="キャンディ">キャンディ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="image">画像</Label>
        <Select value={imageUrl} onValueChange={setImageUrl} required>
          <SelectTrigger>
            <SelectValue placeholder="画像を選択" />
          </SelectTrigger>
          <SelectContent>
            {predefinedImages.map((img, index) => (
              <SelectItem key={index} value={img}>
                画像 {index + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="aspect-video relative">
        <Image
          src={imageUrl}
          alt="Selected image"
          fill
          className="object-cover rounded-md"
        />
      </div>
      <Button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        送信
      </Button>
    </form>
  );
}

function ReplyForm({
  onSubmit,
}: {
  onSubmit: (reply: Omit<Reply, "id">) => void;
}) {
  const [from, setFrom] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ from, content });
    setFrom("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="replyFrom">From</Label>
        <Input
          id="replyFrom"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="replyContent">返信内容</Label>
        <Textarea
          id="replyContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>
      <Button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        返信を送信
      </Button>
    </form>
  );
}
