import { Result, SearchItemProps } from "../types";

function SearchItem({ header, results, emptyStateText }: SearchItemProps) {
  return (
    <>
      <h2>{header}</h2>
      {results.length ? (
        results.map((result: Result, index: number) => (
          <li key={index}>
            <a href={`/${result.type}/${result._id}`} className="dropdown-item">
              <i className="fa fa-building mr-2"></i>
              {result.name}
            </a>
            <hr className="divider" />
          </li>
        ))
      ) : (
        <p>{emptyStateText || "Not found"}</p>
      )}
    </>
  );
}
export default SearchItem;
