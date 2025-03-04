import { getCodeSandboxHost } from "@codesandbox/utils";
import { useEffect, useState } from "react";
import { SearchResult } from "../types";

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost
  ? `https://${codeSandboxHost}`
  : "http://localhost:3001";

function useSearch(value: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult>({
    hotels: [],
    countries: [],
    cities: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    async function searchData(value: string) {
      if (!value || value.length < 3) {
        setSearchResult({
          hotels: [],
          countries: [],
          cities: [],
          isLoading: false,
          error: null,
        });
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const hotelsData = await fetch(`${API_URL}/hotels?search=${value}`);
        const data = await hotelsData.json();

        setSearchResult(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    searchData(value);
  }, [value]);

  return { searchResult, isLoading, error };
}

export default useSearch;
