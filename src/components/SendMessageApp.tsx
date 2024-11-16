import React from "react";
import SendButton from "@/components/SendButton";
import { Message } from "@/components/types";

interface SendMessageAppProps {
  addMessage: (message: Omit<Message, "id" | "likes" | "replies">) => void;
}

export default function SendMessageApp({ addMessage }: SendMessageAppProps) {
  return (
    <div>
      <SendButton
        onClick={() => console.log("ボタンがクリックされました")}
        addMessage={addMessage}
      />
    </div>
  );
}
