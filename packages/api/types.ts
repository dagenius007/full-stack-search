type Result = {
  _id: string;
  name: string;
};
export type SearchResult = {
  hotels: Result[];
  cities: Result[];
  countries: Result[];
};
