"use client";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      style={{
        background: "none",
        border: "none",
        color: "red",
        cursor: "pointer",
      }}
      onClick={(e) => {
        if (!confirm("Delete this post?")) {
          e.preventDefault();
        }
      }}
    >
      🗑 Delete
    </button>
  );
}
    