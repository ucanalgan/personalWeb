import React, { createContext, useContext, useEffect, useState } from 'react';

const GitHubContext = createContext();

export const useGitHub = () => {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
};

const GITHUB_USERNAME = 'ucanalgan';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const GitHubProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchGitHubData = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache
      const cachedData = localStorage.getItem('github-data');
      const cachedTimestamp = localStorage.getItem('github-data-timestamp');
      
      if (!forceRefresh && cachedData && cachedTimestamp) {
        const timeDiff = Date.now() - parseInt(cachedTimestamp);
        if (timeDiff < CACHE_DURATION) {
          const data = JSON.parse(cachedData);
          setUserData(data.user);
          setRepositories(data.repositories);
          setLastUpdate(new Date(parseInt(cachedTimestamp)));
          setIsLoading(false);
          return;
        }
      }

      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
      if (!userResponse.ok) throw new Error('Failed to fetch user data');
      const user = await userResponse.json();

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
      if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
      const repos = await reposResponse.json();

      // Process repositories data
      const processedRepos = repos
        .filter(repo => !repo.fork) // Filter out forked repositories
        .map(repo => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.watchers_count,
          size: repo.size,
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          pushedAt: repo.pushed_at,
          topics: repo.topics || [],
          isPrivate: repo.private,
          archived: repo.archived,
          disabled: repo.disabled
        }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      // Cache the data
      const dataToCache = {
        user,
        repositories: processedRepos
      };
      localStorage.setItem('github-data', JSON.stringify(dataToCache));
      localStorage.setItem('github-data-timestamp', Date.now().toString());

      setUserData(user);
      setRepositories(processedRepos);
      setLastUpdate(new Date());

    } catch (err) {
      console.error('GitHub data fetch error:', err);
      setError(err.message);
      
      // Try to load cached data as fallback
      const cachedData = localStorage.getItem('github-data');
      if (cachedData) {
        const data = JSON.parse(cachedData);
        setUserData(data.user);
        setRepositories(data.repositories);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!userData || !repositories) return null;

    const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks, 0);
    const languages = repositories
      .filter(repo => repo.language)
      .reduce((acc, repo) => {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
        return acc;
      }, {});

    return {
      repositories: repositories.length,
      stars: totalStars,
      forks: totalForks,
      followers: userData.followers,
      following: userData.following,
      languages,
      topLanguage: Object.entries(languages).sort(([,a], [,b]) => b - a)[0]?.[0]
    };
  }, [userData, repositories]);

  // Get featured repositories (most starred, recently updated, etc.)
  const featuredRepositories = React.useMemo(() => {
    if (!repositories.length) return [];
    
    return repositories
      .filter(repo => !repo.archived && !repo.disabled)
      .sort((a, b) => {
        // Sort by stars first, then by recency
        if (b.stars !== a.stars) return b.stars - a.stars;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      })
      .slice(0, 6); // Top 6 repositories
  }, [repositories]);

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const value = {
    userData,
    repositories,
    featuredRepositories,
    stats,
    isLoading,
    error,
    lastUpdate,
    refreshData: () => fetchGitHubData(true)
  };

  return (
    <GitHubContext.Provider value={value}>
      {children}
    </GitHubContext.Provider>
  );
}; 