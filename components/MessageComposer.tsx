
import React from 'react';
import { PaperAirplaneIcon, SpinnerIcon } from './icons';

interface MessageComposerProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
  isSending: boolean;
  disabled: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ message, setMessage, onSend, isSending, disabled }) => {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-md border border-slate-200 ${disabled ? 'opacity-50' : ''}`}>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">Step 2: Compose Message</h3>
      <p className="text-sm text-slate-500 mb-4">Write your base message. Gemini will personalize it for each recipient.</p>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        placeholder="e.g., Hi! Our summer sale starts tomorrow. Get 20% off!"
        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 text-sm"
        disabled={disabled || isSending}
      />
      <button
        onClick={onSend}
        disabled={disabled || isSending || !message.trim()}
        className="mt-4 w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isSending ? (
          <>
            <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Sending...
          </>
        ) : (
          <>
            <PaperAirplaneIcon className="w-5 h-5 mr-2" />
            Personalize & Send Messages
          </>
        )}
      </button>
    </div>
  );
};
