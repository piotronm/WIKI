// src/components/SearchBar.tsx
import { useEffect, useRef, useState } from "react";
import { XCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

type Props = {
  query: string;
  setQuery: (val: string) => void;
};

const SearchBar = ({ query, setQuery }: Props) => {
  const [localQuery, setLocalQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce localQuery -> query
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(localQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [localQuery, setQuery]);

  // Keyboard shortcut (Ctrl+F to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full">
      <label htmlFor="search" className="sr-only">
        Search articles
      </label>
      <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      <input
        ref={inputRef}
        id="search"
        type="text"
        className="border pl-10 pr-8 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Search articles..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
      />
      {localQuery && (
        <button
          className="absolute right-3 top-2.5"
          onClick={() => setLocalQuery("")}
          aria-label="Clear search"
        >
          <XCircleIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
