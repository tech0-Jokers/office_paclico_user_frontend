"use client"; // このコンポーネントはクライアントサイドで動作します
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation"; // Next.js 13以降でのクエリパラメータ取得

// クエリパラメータを管理するカスタムフック
export const useQueryParams = (setOrganizationId, setQrGenerationToken) => {
  const searchParams = useSearchParams(); // クエリパラメータを取得
  const isInitialMount = useRef(true); // 初回マウント判定

  useEffect(() => {
    if (isInitialMount.current) {
      // 初回マウント時のみ処理
      const orgId = searchParams.get("organization_id"); // organization_idの取得
      const qrToken = searchParams.get("qr_generation_token"); // qr_generation_tokenの取得

      if (orgId) {
        setOrganizationId(Number(orgId)); // 数値型に変換してセット
      }

      if (qrToken) {
        setQrGenerationToken(qrToken); // トークンをセット
      }

      isInitialMount.current = false; // 初回マウント終了
    }
  }, [searchParams, setOrganizationId, setQrGenerationToken]);
};
