import { NextRequest, NextResponse } from "next/server";
import type { GitHubRepo } from "@/types";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username =
    searchParams.get("username") ?? process.env.GITHUB_USERNAME ?? "maniscodebase";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "6", 10), 12);

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "manibuildsai.com",
    };

    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30&type=public`,
      { headers, next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ repos: [] });
      }
      throw new Error(`GitHub API ${response.status}`);
    }

    const rawRepos: GitHubRepo[] = await response.json();

    const repos = rawRepos
      .filter((r) => !r.name.includes(".github") && r.description)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, limit)
      .map((r) => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        html_url: r.html_url,
        homepage: r.homepage,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        language: r.language,
        topics: r.topics ?? [],
        updated_at: r.updated_at,
        open_issues_count: r.open_issues_count,
      }));

    return NextResponse.json({ repos }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json({ error: "Failed to fetch repos", repos: [] }, { status: 500 });
  }
}
