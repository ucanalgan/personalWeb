// React 17+ JSX Transform - no React import needed
import { useGitHub } from '../../contexts/GitHubContext';
import Button from '../common/Button';

const GitHubSection = () => {
  const { userData, stats, repositories, isLoading, error } = useGitHub();

  const getLanguageStats = () => {
    if (!repositories?.length) return [];

    const langCount = repositories.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(langCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([lang, count]) => ({
        language: lang,
        count,
        percentage: Math.round((count / repositories.length) * 100)
      }));
  };

  const languageStats = getLanguageStats();

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      Python: '#3776ab',
      HTML: '#e34f26',
      CSS: '#1572b6',
      Vue: '#4fc08d',
      React: '#61dafb',
      Java: '#ed8b00',
      'C++': '#00599c'
    };
    return colors[language] || '#64ffda';
  };

  if (error) {
    return (
      <section id="github" className="py-20 bg-surface/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
              <i className="ri-error-warning-line text-4xl text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Failed to Load GitHub Data</h3>
              <p className="text-text-secondary">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="github" className="py-20 bg-surface/5">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              GitHub <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Activity</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Real-time insights into my development activity and contributions.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="bg-surface/30 border border-border rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-center mb-6">
                {isLoading ? (
                  <div className="w-20 h-20 bg-surface/50 rounded-full mx-auto mb-4 animate-pulse" />
                ) : (
                  <img
                    src={userData?.avatar_url || '/src/assets/images/profile-placeholder.webp'}
                    alt="GitHub Avatar"
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary/20"
                  />
                )}
                <h3 className="text-xl font-bold text-text-primary">
                  {userData?.name || 'Umut Can Algan'}
                </h3>
                <p className="text-text-secondary">
                  @{userData?.login || 'ucanalgan'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Repositories:</span>
                  <span className="text-text-primary font-semibold">
                    {stats?.repositories || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Stars:</span>
                  <span className="text-text-primary font-semibold">
                    {stats?.stars || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Followers:</span>
                  <span className="text-text-primary font-semibold">
                    {stats?.followers || 0}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  href={`https://github.com/${userData?.login || 'ucanalgan'}`}
                  target="_blank"
                  variant="secondary"
                  icon="ri-github-line"
                  className="w-full"
                >
                  View Profile
                </Button>
              </div>
            </div>

            {/* Language Statistics */}
            <div className="bg-surface/30 border border-border rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-text-primary mb-6">Languages</h3>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="flex justify-between mb-2">
                        <div className="h-4 bg-surface/50 rounded w-20" />
                        <div className="h-4 bg-surface/50 rounded w-10" />
                      </div>
                      <div className="h-2 bg-surface/50 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {languageStats.map((lang, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: getLanguageColor(lang.language) }}
                          />
                          <span className="text-text-primary">{lang.language}</span>
                        </div>
                        <span className="text-text-secondary text-sm">{lang.percentage}%</span>
                      </div>
                      <div className="w-full bg-surface/20 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{
                            backgroundColor: getLanguageColor(lang.language),
                            width: `${lang.percentage}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-surface/30 border border-border rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-text-primary mb-6">Recent Repos</h3>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-4 bg-surface/50 rounded mb-2" />
                      <div className="h-3 bg-surface/30 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {repositories?.slice(0, 3).map((repo, index) => (
                    <div key={index} className="group">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 -m-3 rounded-lg hover:bg-surface/20 transition-colors duration-300"
                      >
                        <h4 className="font-semibold text-text-primary group-hover:text-primary transition-colors duration-300">
                          {repo.name}
                        </h4>
                        <p className="text-text-secondary text-sm">
                          {repo.description || 'No description'}
                        </p>
                        <div className="flex items-center text-xs text-text-secondary mt-2">
                          {repo.language && (
                            <span className="flex items-center mr-4">
                              <span
                                className="w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: getLanguageColor(repo.language) }}
                              />
                              {repo.language}
                            </span>
                          )}
                          <span>⭐ {repo.stars}</span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubSection;
