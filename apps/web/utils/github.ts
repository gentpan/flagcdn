export const DEFAULT_GITHUB_REPO = "gentpan/flagcdn";

export function githubRepoUrl(repo: string) {
  return `https://github.com/${repo}`;
}

export function githubIssuesUrl(repo: string) {
  return `https://github.com/${repo}/issues`;
}
