export interface GithubUser {
    login: string;
    id: number;
    avatar_url: string;
    name: string | null;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
}

export interface GithubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    default_branch: string;
}
