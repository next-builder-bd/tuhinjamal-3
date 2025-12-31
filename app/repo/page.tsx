"use client";

import { useState } from "react";
import { createRepoFromTemplate } from "../actions/createRepo";

export default function HomePage() {
  const [repoName, setRepoName] = useState("");
  const [repoUrl, setRepoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateRepo = async () => {
    if (!repoName.trim()) {
      alert("Please enter a repo name");
      return;
    }

    setLoading(true);
    try {
      const url = await createRepoFromTemplate(repoName.trim());
      setRepoUrl(url);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Failed to create repo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Create GitHub Repo from Template</h1>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Enter new repo name"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          style={{ padding: 8, width: 300, marginRight: 8 }}
        />
        <button
          onClick={handleCreateRepo}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2ea44f",
            color: "white",
            borderRadius: 6,
          }}
        >
          {loading ? "Creating..." : "Create Repo"}
        </button>
      </div>

      {repoUrl && (
        <p>
          ✅ Repo created!{" "}
          <a href={repoUrl} target="_blank" rel="noopener noreferrer">
            View Repo
          </a>
        </p>
      )}
    </main>
  );
}
