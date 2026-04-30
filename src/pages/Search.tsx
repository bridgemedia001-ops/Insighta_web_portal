import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import type { ProfilePageResponse } from '../types';

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProfilePageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const handleSearch = async (searchQuery: string = query, pageNum: number = 1) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.searchProfiles(searchQuery, pageNum, 10);
      setResults(response);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query, 1);
  };

  const handlePageChange = (newPage: number) => {
    handleSearch(query, newPage);
  };

  const handleProfileClick = (id: string) => {
    navigate(`/profiles/${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search Profiles</h1>
        <p className="text-gray-600 mt-1">Use natural language to find profiles</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'young males from nigeria' or 'female adults over 30'"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {results && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Found {results.total} profiles for "{query}"
            </p>
          </div>

          {results.data.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">No profiles found matching your search</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {results.data.map((profile) => (
                      <div
                        key={profile.id}
                        onClick={() => handleProfileClick(profile.id)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{profile.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {profile.gender} • {profile.age} years old • {profile.country_name}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              {results.total_pages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Page {page} of {results.total_pages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === results.total_pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!results && !isLoading && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Searching</h3>
            <p className="text-gray-500">
              Enter a natural language query above to search for profiles
            </p>
            <div className="mt-4 text-sm text-gray-400">
              <p>Try examples like:</p>
              <ul className="mt-2 space-y-1">
                <li>"young males from nigeria"</li>
                <li>"female adults over 30"</li>
                <li>"seniors from the united states"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
