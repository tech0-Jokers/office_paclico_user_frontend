// types.tsの中に、型定義を記述する

// MessageとReplyCommentの型定義を使用
export interface Message {
  message_id: number; // メッセージID
  sender_user_id: number; // 送信者のユーザーID
  receiver_user_id: number; // 受信者のユーザーID
  message_content: string; // メッセージ内容
  product_id: number; // 商品ID
  product_name: string; // 商品名
  send_date: Date | null; // メッセージ送信日時（nullの場合もあり）
  sender_user_name: string; // 送信者の名前
  receiver_user_name: string; // 受信者の名前
  sender_user_name_manual_input: string; // 送信者の名前（手動入力）
  receiver_user_name_manual_input: string; // 受信者の名前（手動入力）
  product_image_url: string | null; // 商品画像URL（ない場合はnull）
  count_of_likes: number; // 「いいね」の数
  reply_comments: ReplyComment[]; // 返信コメントのリスト
  reply_count?: number; // reply_countを追加
}

// ReplyComment 型の定義
export interface ReplyComment {
  reply_comment_id: number; // 返信コメントID
  comment_user_id: number; // コメントユーザーID
  comment_user_name: string; // コメントユーザー名
  comment_user_name_manual_input: string; // コメントユーザー名
  message_content: string; // コメント内容
  send_date: Date | null; // コメント送信日時
}

// 返信の型
export interface Reply {
  id: number;
  send_date: string;
  content: string;
  from_name: string; // 追加
  from_name_input: string;
  comment_user_name: string;
  comment_user_name_manual_input: string;
}

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
