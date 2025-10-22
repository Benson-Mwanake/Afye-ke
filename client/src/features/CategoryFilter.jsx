import React from "react";

const categories = ["All", "Prevention", "Nutrition", "Hygiene", "Maternal"];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1 rounded-full border ${
            selected === cat
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
