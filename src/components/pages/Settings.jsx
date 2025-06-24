import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Bell, User, Shield, Palette, Globe } from 'lucide-react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Checkbox from '@/components/atoms/Checkbox'

const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    username: 'John Doe',
    email: 'john.doe@example.com',
    timezone: 'UTC-5',
    language: 'en',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyDigest: true,
    
    // Appearance Settings
    theme: 'light',
    compactView: false,
    showProgress: true,
    
    // Privacy Settings
    profileVisibility: 'private',
    dataSharing: false,
    analytics: true
  })

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Settings saved:', settings)
  }

  const handleReset = () => {
    // TODO: Implement reset to defaults
    console.log('Settings reset to defaults')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">General</h2>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Username"
                value={settings.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter your username"
              />
              
              <Input
                label="Email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
              />
              
              <Select
                label="Timezone"
                value={settings.timezone}
                onChange={(value) => handleInputChange('timezone', value)}
                options={[
                  { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
                  { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
                  { value: 'UTC-6', label: 'Central Time (UTC-6)' },
                  { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
                  { value: 'UTC', label: 'UTC' }
                ]}
              />
              
              <Select
                label="Language"
                value={settings.language}
                onChange={(value) => handleInputChange('language', value)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' }
                ]}
              />
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <Checkbox
                id="emailNotifications"
                label="Email Notifications"
                checked={settings.emailNotifications}
                onChange={(checked) => handleInputChange('emailNotifications', checked)}
                description="Receive updates via email"
              />
              
              <Checkbox
                id="pushNotifications"
                label="Push Notifications"
                checked={settings.pushNotifications}
                onChange={(checked) => handleInputChange('pushNotifications', checked)}
                description="Browser push notifications"
              />
              
              <Checkbox
                id="taskReminders"
                label="Task Reminders"
                checked={settings.taskReminders}
                onChange={(checked) => handleInputChange('taskReminders', checked)}
                description="Remind me about due tasks"
              />
              
              <Checkbox
                id="weeklyDigest"
                label="Weekly Digest"
                checked={settings.weeklyDigest}
                onChange={(checked) => handleInputChange('weeklyDigest', checked)}
                description="Weekly summary of activity"
              />
            </div>
          </Card>
        </motion.div>

        {/* Appearance & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Appearance */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <Select
                label="Theme"
                value={settings.theme}
                onChange={(value) => handleInputChange('theme', value)}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'auto', label: 'Auto' }
                ]}
              />
              
              <Checkbox
                id="compactView"
                label="Compact View"
                checked={settings.compactView}
                onChange={(checked) => handleInputChange('compactView', checked)}
                description="Show more items in lists"
              />
              
              <Checkbox
                id="showProgress"
                label="Show Progress Indicators"
                checked={settings.showProgress}
                onChange={(checked) => handleInputChange('showProgress', checked)}
                description="Display progress rings and bars"
              />
            </div>
          </Card>

          {/* Privacy */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
            </div>
            
            <div className="space-y-4">
              <Select
                label="Profile Visibility"
                value={settings.profileVisibility}
                onChange={(value) => handleInputChange('profileVisibility', value)}
                options={[
                  { value: 'private', label: 'Private' },
                  { value: 'friends', label: 'Friends Only' },
                  { value: 'public', label: 'Public' }
                ]}
              />
              
              <Checkbox
                id="dataSharing"
                label="Data Sharing"
                checked={settings.dataSharing}
                onChange={(checked) => handleInputChange('dataSharing', checked)}
                description="Share anonymized data for improvements"
              />
              
              <Checkbox
                id="analytics"
                label="Analytics"
                checked={settings.analytics}
                onChange={(checked) => handleInputChange('analytics', checked)}
                description="Help improve the app with usage data"
              />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end gap-3 pt-6 border-t border-gray-200"
      >
        <Button
          variant="outline"
          onClick={handleReset}
        >
          Reset to Defaults
        </Button>
        <Button
          onClick={handleSave}
          className="bg-gradient-purple"
        >
          Save Changes
        </Button>
      </motion.div>
    </div>
  )
}

export default Settings