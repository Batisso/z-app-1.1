"use client";

import React, { useState } from "react";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // Here you can add logic to save settings to your backend
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted px-4 py-12">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your display name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Enable Notifications</span>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition ${
                    notifications ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition ${
                    darkMode ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Email Updates</span>
                <button
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className={`w-12 h-6 rounded-full transition ${
                    emailUpdates ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition transform ${
                      emailUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSave}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
            >
              Save Changes
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>

          {saved && (
            <div className="text-center text-green-600 font-semibold">
              Settings saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;