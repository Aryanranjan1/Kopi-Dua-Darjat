
'use client';

import ContentForm from './ContentForm';

export default function StaticContentManager() {
  return (
    <div>
        <p className="text-sm text-zinc-400 mb-6 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            This section allows you to edit the text content from across your website. Changes are saved directly to the 'settings/content' document in Firestore.
        </p>
        <ContentForm />
    </div>
  );
}
