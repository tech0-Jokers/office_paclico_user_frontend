import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation"; // Next.js 13以降でのクエリパラメータ取得

export const useQueryParams = (setOrganizationId) => {
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      const orgId = searchParams.get("organization_id");
      if (orgId) {
        setOrganizationId(Number(orgId)); // 数値型に変換してセット
      }
      isInitialMount.current = false;
    }
  }, [searchParams, setOrganizationId]);
};
