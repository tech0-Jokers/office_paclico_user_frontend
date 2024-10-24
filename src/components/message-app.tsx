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
import Image from "next/image";

type Message = {
  id: number;
  to: string;
  from: string;
  message: string;
  treat: string;
  likes: number;
};

const predefinedMessages = [
  "ありがとうございます！",
  "頑張ってください！",
  "助かりました！",
  "お疲れ様です！",
  "素晴らしい仕事です！",
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
    },
    {
      id: 2,
      to: "佐藤さん",
      from: "高橋",
      message: "頑張ってください！",
      treat: "クッキー",
      likes: 0,
    },
  ]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const addMessage = (newMessage: Omit<Message, "id" | "likes">) => {
    setMessages([
      ...messages,
      { ...newMessage, id: messages.length + 1, likes: 0 },
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
              <p className="font-semibold text-purple-700">To: {message.to}</p>
              <p className="text-purple-600">From: {message.from}</p>
              <p className="text-purple-800 mt-2">{message.message}</p>
              <div className="mt-2">
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
        <DialogContent className="bg-white">
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
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>メッセージ詳細</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
  onSubmit: (message: Omit<Message, "id" | "likes">) => void;
}) {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState(predefinedMessages[0]);
  const [treat, setTreat] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ to, from, message, treat });
    setTo("");
    setFrom("");
    setMessage(predefinedMessages[0]);
    setTreat("");
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
      <Button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        送信
      </Button>
    </form>
  );
}
