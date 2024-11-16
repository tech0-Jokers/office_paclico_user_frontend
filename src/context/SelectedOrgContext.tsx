"use client"; // このコンポーネントはクライアントサイドで動作します

import { createContext, useContext, useState, ReactNode } from "react";

// コンテキストの型を定義
type SelectedOrgContextType = {
  selectedOrgId: string | null; // 現在選択中の組織ID
  setSelectedOrgId: (id: string | null) => void; // 組織IDを設定する関数
};

// コンテキストの初期値を定義
const SelectedOrgContext = createContext<SelectedOrgContextType | undefined>(
  undefined
);

// コンテキストプロバイダーを作成
export function SelectedOrgProvider({ children }: { children: ReactNode }) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  return (
    <SelectedOrgContext.Provider value={{ selectedOrgId, setSelectedOrgId }}>
      {children}
    </SelectedOrgContext.Provider>
  );
}

// コンテキストを利用するカスタムフック
export function useSelectedOrg() {
  const context = useContext(SelectedOrgContext);
  if (!context) {
    throw new Error(
      "useSelectedOrgはSelectedOrgProviderの内側で使用してください"
    );
  }
  return context;
}
