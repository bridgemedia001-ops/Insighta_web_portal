import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Mail, Calendar, Shield, LogOut } from 'lucide-react';

export const Account: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account</h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
                    <span className="text-white text-3xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium text-gray-900">{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-900 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="font-medium text-gray-900">
                      {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Account Created</p>
                    <p className="font-medium text-gray-900">
                      {new Date(user.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              {user.role === 'ADMIN' ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-gray-700">Create and delete profiles</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-gray-700">View and search all profiles</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-gray-700">Export profiles to CSV</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-gray-700">Access to admin endpoints</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-gray-700">View all profiles</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-gray-700">Search profiles with natural language</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-gray-700">Export profiles to CSV</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <p className="text-gray-700">Cannot create or delete profiles</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="danger"
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
