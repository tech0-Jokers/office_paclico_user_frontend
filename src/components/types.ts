// types.tsの中に、型定義を記述する
// メッセージの型
export type Message = {
  id: number;
  to: string;
  from: string;
  message: string;
  treat: string;
  likes: number;
  replies: Reply[];
  imageUrl: string;
};

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
