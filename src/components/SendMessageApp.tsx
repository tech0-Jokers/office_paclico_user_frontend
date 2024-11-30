import React from "react";
import SendButton from "@/components/SendButton";
import { Message } from "@/components/types";

interface SendMessageAppProps {
  addMessage: (message: Omit<Message, "id" | "likes" | "replies">) => void;
  organizationId: number; // 追加
}

export default function SendMessageApp({
  addMessage,
  organizationId,
}: SendMessageAppProps) {
  return (
    <div>
      <SendButton
        onClick={() => console.log("ボタンがクリックされました")}
        addMessage={addMessage}
        organizationId={organizationId} // 追加
      />
    </div>
  );
}
