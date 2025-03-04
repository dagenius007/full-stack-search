import { InputProps } from "../types";
import ClipLoader from "react-spinners/ClipLoader";

function Input({
  onChange,
  value,
  showClearBtn,
  handleClear = () => {},
  isLoading,
}: InputProps) {
  return (
    <div className="form">
      <i className="fa fa-search"></i>
      <input
        type="text"
        className="form-control form-input"
        placeholder="Search accommodation..."
        onChange={onChange}
        value={value}
      />
      {showClearBtn && (
        <div className="span-container">
          <ClipLoader
            color="#EAECF0"
            loading={isLoading}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <span
            className="left-pan"
            onClick={handleClear}
            data-testid="close-icon"
          >
            <i className="fa fa-close"></i>
          </span>
        </div>
      )}
    </div>
  );
}

export default Input;
