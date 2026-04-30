import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Search, Download, Plus, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import type { Profile, Filters } from '../types';

export const ProfilesList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    order: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getProfiles(filters);
      setProfiles(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.total_pages,
      });
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to page 1 when filters change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await apiService.exportProfiles(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profiles_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting profiles:', error);
      alert('Failed to export profiles');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateProfile = () => {
    navigate('/profiles/create');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profiles</h1>
          <p className="text-gray-600 mt-1">
            {pagination.total.toLocaleString()} profiles in database
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
          </Button>
          {isAdmin && (
            <Button onClick={handleCreateProfile} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Profile</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={filters.gender || ''}
                  onChange={(e) => handleFilterChange('gender', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={filters.country_id || ''}
                  onChange={(e) => handleFilterChange('country_id', e.target.value || undefined)}
                  placeholder="e.g., US, NG, GB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                <select
                  value={filters.age_group || ''}
                  onChange={(e) => handleFilterChange('age_group', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All</option>
                  <option value="child">Child (0-12)</option>
                  <option value="teen">Teen (13-19)</option>
                  <option value="adult">Adult (20-59)</option>
                  <option value="senior">Senior (60+)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.sort_by || 'created_at'}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="created_at">Created At</option>
                  <option value="age">Age</option>
                  <option value="country_probability">Country Probability</option>
                  <option value="gender_probability">Gender Probability</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <select
                  value={filters.order || 'desc'}
                  onChange={(e) => handleFilterChange('order', e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                <input
                  type="number"
                  value={filters.min_age || ''}
                  onChange={(e) => handleFilterChange('min_age', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Minimum age"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
                <input
                  type="number"
                  value={filters.max_age || ''}
                  onChange={(e) => handleFilterChange('max_age', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Maximum age"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Per Page</label>
                <select
                  value={filters.limit || 10}
                  onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profiles Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No profiles found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          profile.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>
                          {profile.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {profile.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {profile.country_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate(`/profiles/${profile.id}`)}
                          className="text-primary hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} profiles
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
