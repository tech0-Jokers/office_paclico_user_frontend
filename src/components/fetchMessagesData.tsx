// src/app/components/fetchMessagesServer.tsx

interface Message {
  message_id: number; // プロパティ名を修正
  sender_user_id: number;
  receiver_user_id: number;
  message_content: string;
  product_id: number;
  send_date: string | null;
  sender_user_name: string;
  receiver_user_name: string;
  imageUrl: string | null;
  likes: number;
}

interface Props {
  organizationId: string;
}

const fetchMessagesData = async (
  organizationId: number
): Promise<Message[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(
      "API URLが設定されていません。環境変数を確認してください。"
    );
  }

  const requestUrl = `${apiUrl}/messages/?organization_id=${organizationId}`;
  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error(`データ取得エラー: ${response.statusText}`);
  }

  const data = await response.json();

  return data.messages.map((msg: any) => ({
    message_id: msg.message_id,
    message_content: msg.message_content,
    sender_user_id: msg.sender_user_id,
    receiver_user_id: msg.receiver_user_id,
    sender_user_name: msg.sender_user_name,
    receiver_user_name: msg.receiver_user_name,
    product_id: msg.product_id,
    product_name: msg.product_name,
    send_date: msg.send_date ? new Date(msg.send_date) : null,
    likes: 0,
    replies: [],
    product_image_url: msg.product_image_url || null, // APIに画像URLが含まれると仮定
  }));
};

export default fetchMessagesData;
