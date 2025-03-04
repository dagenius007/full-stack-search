import { ChangeEvent } from "react";

export type Result = {
  _id: string;
  name: string;
  type: string;
};
export type SearchResult = {
  hotels: Result[];
  countries: Result[];
  cities: Result[];
  isLoading: boolean;
  error: Error | null;
};

export type SearchItemProps = {
  header: string;
  emptyStateText?: string;
  results: Result[];
};

export type InputProps = {
  value: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  showClearBtn?: boolean;
  handleClear?: () => void;
  isLoading: boolean;
};
