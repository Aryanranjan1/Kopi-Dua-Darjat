
'use client';

import { siteContentData } from '@/lib/site-content';
import ContentForm from './ContentForm';

export default function StaticContentManager() {
  return (
    <div>
        <p className="text-sm text-zinc-400 mb-6 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            This section allows you to edit the hardcoded text content from across your website. Make your changes and click "Save Changes" at the bottom to update the content file on the server.
        </p>
        <ContentForm
            initialData={siteContentData}
        />
    </div>
  );
}
