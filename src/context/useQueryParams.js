"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const useQueryParams = (setOrganizationId, setQrGenerationToken) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orgId = searchParams.get("organization_id");
    const qrToken = searchParams.get("qr_generation_token");

    if (orgId) {
      setOrganizationId(Number(orgId)); // 数値型に変換してセット
    }

    if (qrToken) {
      setQrGenerationToken(qrToken); // トークンをセット
    }
  }, [searchParams, setOrganizationId, setQrGenerationToken]);
};
