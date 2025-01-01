'use client'

import { useState, useEffect } from 'react'

interface Settings {
  switchTrigger: string;
  cursorAtEnd: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
}

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>({
    switchTrigger: '\n',
    cursorAtEnd: false
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem('editorSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('editorSettings', JSON.stringify(settings))
    onSave(settings)
    onClose()
  }

  if (!isOpen) return null

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl mb-6 font-bold text-gray-800">Editor Settings</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="switchTrigger">
                  Switch Trigger String
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="switchTrigger"
                    type="text"
                    placeholder="Enter trigger string"
                    name="switchTrigger"
                    value={settings.switchTrigger}
                    onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cursorAtEnd">
                  Limit cursor to end
                </label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input
                      type="checkbox"
                      name="cursorAtEnd"
                      id="cursorAtEnd"
                      checked={settings.cursorAtEnd}
                      onChange={handleChange}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                      htmlFor="cursorAtEnd"
                      className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
                <span className="text-gray-700 text-sm">{settings.cursorAtEnd ? 'On' : 'Off'}</span>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
        <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #68D391;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #68D391;
        }
      `}</style>
      </div>
  )
}

