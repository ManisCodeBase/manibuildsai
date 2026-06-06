"use client";

import { useState, useEffect } from "react";
import type { GitHubRepo } from "@/types";

interface UseGitHubReposResult {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

export function useGitHubRepos(username: string, limit = 6): UseGitHubReposResult {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRepos() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30&type=public`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "manibuildsai.com",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const rawRepos: GitHubRepo[] = await response.json();

        const filtered = rawRepos
          .filter((repo) => !repo.name.includes(".github") && repo.description)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, Math.min(limit, 12))
          .map((repo) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            homepage: repo.homepage,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            language: repo.language,
            topics: repo.topics ?? [],
            updated_at: repo.updated_at,
            open_issues_count: repo.open_issues_count,
          }));

        setRepos(filtered);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to fetch repositories");
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
    return () => controller.abort();
  }, [username, limit]);

  return { repos, loading, error };
}
