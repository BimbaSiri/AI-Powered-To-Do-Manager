import React, { useState } from 'react';
import { AIsuggestion } from '../types';
import { generateAISuggestions } from '../utils/ai';
import { Sparkles, Plus, X } from 'lucide-react';

interface AISuggestionsProps {
  onAddTask: (suggestion: AIsuggestion) => void;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({ onAddTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AIsuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    // Simulate AI processing time
    setTimeout(() => {
      const newSuggestions = generateAISuggestions();
      setSuggestions(newSuggestions);
      setIsGenerating(false);
    }, 1000);
  };

  const handleAddSuggestion = (suggestion: AIsuggestion) => {
    onAddTask(suggestion);
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          handleGenerateSuggestions();
        }}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Smart Task Suggestions</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="max-h-64 overflow-y-auto space-y-3">
            {isGenerating ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating smart suggestions...</p>
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {suggestion.priority} priority
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddSuggestion(suggestion)}
                      className="p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Click the button below to generate smart task suggestions</p>
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <button
              onClick={handleGenerateSuggestions}
              className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
            >
              Generate New Suggestions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};