import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { MessageComposer } from './components/MessageComposer';
import { StatusDashboard } from './components/StatusDashboard';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { Recipient, RecipientStatus } from './types';
// Removed Gemini import - using Twilio only

const App: React.FC = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [baseMessage, setBaseMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);

  const handleFileLoaded = useCallback((data: string[][]) => {
    setError(null);
    if (data.length < 2) {
      setError("CSV file must contain a header row and at least one data row.");
      setRecipients([]);
      return;
    }

    const header = data[0].map(h => h.toLowerCase().trim());
    const phoneIndex = header.findIndex(h => h.includes('phone') || h.includes('number'));
    const nameIndex = header.findIndex(h => h.includes('name'));

    if (phoneIndex === -1) {
      setError("Could not find a 'phone' or 'number' column in the CSV header.");
      setRecipients([]);
      return;
    }

    const newRecipients: Recipient[] = data.slice(1).map((row, index) => {
      let phoneNumber = row[phoneIndex]?.trim();

      // Auto-format phone number to E.164 format
      if (phoneNumber) {
        // Remove any non-digit characters except +
        phoneNumber = phoneNumber.replace(/[^\d+]/g, '');

        // If doesn't start with +, add +1 for US numbers
        if (!phoneNumber.startsWith('+')) {
          phoneNumber = '+1' + phoneNumber;
        }
      }

      return {
        id: `${Date.now()}-${index}`,
        name: nameIndex !== -1 ? row[nameIndex] : undefined,
        number: phoneNumber,
        status: RecipientStatus.PENDING,
        personalizedMessage: '',
      };
    }).filter(r => r.number); // Filter out empty rows

    if (newRecipients.length === 0) {
      setError("No valid phone numbers found in the CSV file.");
    }
    setRecipients(newRecipients);
  }, []);

  const handleSendMessages = async () => {
    if (!baseMessage.trim() || recipients.length === 0 || isSending) return;

    setIsSending(true);
    setError(null);

    const recipientsToSend = recipients.filter(r => r.status !== RecipientStatus.SENT);

    for (const recipient of recipientsToSend) {
      try {
        setRecipients(prev => prev.map(r => r.id === recipient.id ? { ...r, status: RecipientStatus.SENDING } : r));

        // Use base message directly without Gemini personalization
        // Optionally add name if available
        let messageToSend = baseMessage;
        if (recipient.name) {
          messageToSend = baseMessage.replace(/{name}/gi, recipient.name);
        }

        // Call the secure backend API to send the SMS
        const response = await fetch('/api/send-sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: recipient.number,
            message: messageToSend,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: 'Server error', details: errorText };
          }

          // Log the full error
          const fullError = `[${new Date().toISOString()}] Failed for ${recipient.number}: Status ${response.status} - ${JSON.stringify(errorData)}`;
          setErrorLogs(prev => [...prev, fullError]);

          throw new Error(errorData.details || errorData.error || 'Failed to send message via API.');
        }

        const result = await response.json();

        setRecipients(prev => prev.map(r => r.id === recipient.id ? { ...r, status: RecipientStatus.SENT, personalizedMessage: messageToSend } : r));

      } catch (err: any) {
        console.error(`Failed to process message for ${recipient.number}:`, err);
        const errorMsg = `[${new Date().toISOString()}] Error for ${recipient.number}: ${err.message} - ${err.stack || ''}`;
        setErrorLogs(prev => [...prev, errorMsg]);
        setRecipients(prev => prev.map(r => r.id === recipient.id ? { ...r, status: RecipientStatus.FAILED } : r));
      }
    }

    setIsSending(false);
  };

  const handleReset = () => {
    setRecipients([]);
    setBaseMessage('');
    setIsSending(false);
    setError(null);
    setErrorLogs([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <StatsCards recipients={recipients} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {errorLogs.length > 0 && (
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-orange-900">Error Logs ({errorLogs.length})</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(errorLogs.join('\n\n'));
                  alert('Error logs copied to clipboard!');
                }}
                className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
              >
                Copy All
              </button>
            </div>
            <div className="bg-white border border-orange-200 rounded p-3 max-h-60 overflow-y-auto">
              <pre className="text-xs text-slate-800 whitespace-pre-wrap font-mono">
                {errorLogs.join('\n\n')}
              </pre>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <FileUpload onFileLoaded={handleFileLoaded} onReset={handleReset} disabled={recipients.length > 0} />
            <MessageComposer
              message={baseMessage}
              setMessage={setBaseMessage}
              onSend={handleSendMessages}
              isSending={isSending}
              disabled={recipients.length === 0}
            />
          </div>
          <div className="lg:col-span-2">
            <StatusDashboard recipients={recipients} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
