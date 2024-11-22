// types.tsの中に、型定義を記述する
// メッセージの型
export interface Message {
  message_id: number; // プロパティ名を修正
  sender_user_id: number;
  receiver_user_id: number;
  message_content: string;
  product_id: number;
  product_name: string;
  send_date: string | null;
  sender_user_name: string;
  receiver_user_name: string;
  product_image_url: string | null;
  count_of_likes: number;
  replies: Reply[];
  reply_comments: ReplyComment[];
}

interface ReplyComment {
  reply_comment_id: number; // リプライコメントのID
  comment_user_id: number; // コメントしたユーザーのID
  comment_user_name: string; // コメントしたユーザーの名前
  message_content: string; // コメントの内容
  send_date: Date | null; // コメント送信日時（nullの場合もあり）
}

// 返信の型
export type Reply = {
  id: number;
  from: string;
  content: string;
};

// チョコレートの型
export type Chocolate = {
  Index: number;
  Product_Name: string;
  Image_Url: string;
};

// 入庫アイテムの型
export type Products = {
  product_id: number;
  product_name: string;
  product_image_url: string;
  sales_amount: number;
  stock_quantity: number;
};
