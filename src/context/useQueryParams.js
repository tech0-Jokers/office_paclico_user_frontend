import { useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Next.js 13以降でのクエリパラメータ取得

export const useQueryParams = (setOrganizationId) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orgId = searchParams.get("organization_id");
    if (orgId) {
      setOrganizationId(Number(orgId)); // 数値型に変換してセット
    }
  }, [searchParams, setOrganizationId]);
};
