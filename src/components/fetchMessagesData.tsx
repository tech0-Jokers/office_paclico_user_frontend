import { Message, ReplyComment } from "@/components/types";

// メッセージデータを取得する関数
const fetchMessagesData = async (
  organizationId: number // 組織IDを引数として受け取る
): Promise<Message[]> => {
  // 環境変数からAPIのURLを取得
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // API URLが未設定の場合はエラーを投げる
  if (!apiUrl) {
    throw new Error(
      "API URLが設定されていません。環境変数を確認してください。"
    );
  }

  // APIリクエストURLを組み立てる
  const requestUrl = `${apiUrl}/messages/?organization_id=${organizationId}`;

  // データをAPIから取得
  const response = await fetch(requestUrl);

  // レスポンスがエラーの場合は例外を投げる
  if (!response.ok) {
    throw new Error(`データ取得エラー: ${response.statusText}`);
  }

  // レスポンスのJSONデータをパース
  const data = await response.json();

  // メッセージデータを加工して返す
  return data.messages
    .map((msg: Message) => ({
      message_id: msg.message_id, // メッセージID
      message_content: msg.message_content, // メッセージ内容
      sender_user_id: msg.sender_user_id, // 送信者のユーザーID
      receiver_user_id: msg.receiver_user_id, // 受信者のユーザーID
      sender_user_name: msg.sender_user_name, // 送信者の名前
      receiver_user_name: msg.receiver_user_name, // 受信者の名前
      product_id: msg.product_id, // 商品ID
      product_name: msg.product_name, // 商品名
      send_date: msg.send_date ? new Date(msg.send_date) : null, // 送信日時（nullの場合はnullをそのまま返す）
      count_of_likes: msg.count_of_likes, // 「いいね」の数
      product_image_url: msg.product_image_url || null, // 商品画像URL（ない場合はnull）
      reply_comments: (msg.reply_comments || []).map((reply: ReplyComment) => ({
        reply_comment_id: reply.reply_comment_id, // 返信コメントのID
        comment_user_id: reply.comment_user_id, // コメントユーザーID
        comment_user_name: reply.comment_user_name, // コメントユーザー名
        message_content: reply.message_content, // コメント内容
        send_date: reply.send_date ? new Date(reply.send_date) : null, // コメント送信日時
      })),
      reply_count: msg.reply_comments?.length || 0, // 返信メッセージの数
    }))
    .sort((a: Message, b: Message) => {
      // メッセージを送信日時で新しい順にソート
      if (!a.send_date && !b.send_date) return 0; // 両方nullの場合は順序を維持
      if (!a.send_date) return 1; // aの日時がnullなら後ろに移動
      if (!b.send_date) return -1; // bの日時がnullなら前に移動
      return b.send_date.getTime() - a.send_date.getTime(); // 日付を比較して新しい順に並べる
    });
};

// 他のファイルでこの関数を使えるようにエクスポート
export default fetchMessagesData;
