import React from "react";
import SendButton from "@/components/SendButton";

interface SendMessageAppProps {
  organizationId: number; // 追加
}

export default function SendMessageApp({
  organizationId,
}: SendMessageAppProps) {
  return (
    <div>
      <SendButton
        onClick={() => console.log("ボタンがクリックされました")}
        organizationId={organizationId} // 追加
      />
    </div>
  );
}
