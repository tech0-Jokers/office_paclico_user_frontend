import { createContext, useContext, useState } from "react";

// Contextを作成
const OrganizationContext = createContext();

// カスタムフック: Contextを利用するためのヘルパー
export const useOrganization = () => {
  return useContext(OrganizationContext);
};

// Providerコンポーネント: 他のコンポーネントでContextを共有する
export const OrganizationProvider = ({ children }) => {
  const [organizationId, setOrganizationId] = useState(null);

  return (
    <OrganizationContext.Provider value={{ organizationId, setOrganizationId }}>
      {children}
    </OrganizationContext.Provider>
  );
};
