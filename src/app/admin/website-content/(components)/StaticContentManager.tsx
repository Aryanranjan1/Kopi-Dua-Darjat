'use client';

import { siteContentData } from '@/lib/site-content';
import ContentForm from './ContentForm';

export default function StaticContentManager() {

  const handleFormSubmit = async (data: any) => {
    // This function doesn't actually save. It's a placeholder.
    // I will intercept the user's request to "save" and apply the file changes.
    alert("This 'Save' button is for demonstration purposes. To save changes, please describe the edits you want me to make, and I will update the code for you.");
    console.log("Form data to save:", data);
  };
  
  return (
    <div>
        <p className="text-sm text-zinc-400 mb-6 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            This section allows you to edit the hardcoded text content from across your website. When you are ready to save your changes, please describe them to me (e.g., "Change the headline on the franchise page") and I will update the website's code for you. The "Save" buttons here are for demonstration and are currently disabled.
        </p>
        <ContentForm
            initialData={siteContentData}
            onFormSubmit={handleFormSubmit}
        />
    </div>
  );
}
