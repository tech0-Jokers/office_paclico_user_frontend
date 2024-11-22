// src/app/components/fetchMessagesServer.tsx

interface Message {
  message_id: number;
  sender_user_id: number;
  receiver_user_id: number;
  message_content: string;
  product_id: number;
  product_name: string;
  send_date: Date | null; // send_dateをDate型に修正
  sender_user_name: string;
  receiver_user_name: string;
  product_image_url: string | null;
  count_of_likes: number;
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

  // メッセージをマッピングし、日付でソート
  return data.messages
    .map(
      (msg: any): Message => ({
        message_id: msg.message_id,
        message_content: msg.message_content,
        sender_user_id: msg.sender_user_id,
        receiver_user_id: msg.receiver_user_id,
        sender_user_name: msg.sender_user_name,
        receiver_user_name: msg.receiver_user_name,
        product_id: msg.product_id,
        product_name: msg.product_name,
        send_date: msg.send_date ? new Date(msg.send_date) : null,
        count_of_likes: msg.count_of_likes,
        product_image_url: msg.product_image_url || null, // APIに画像URLが含まれると仮定
      })
    )
    .sort((a: Message, b: Message) => {
      // send_dateでソート（新しい順）
      if (!a.send_date && !b.send_date) return 0; // 両方nullの場合は順序維持
      if (!a.send_date) return 1; // aがnullの場合、後ろに移動
      if (!b.send_date) return -1; // bがnullの場合、前に移動
      return b.send_date.getTime() - a.send_date.getTime(); // 日付で比較
    });
};

export default fetchMessagesData;
