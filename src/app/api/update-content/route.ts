
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// This is a simple in-memory check. In a real app, this should be a robust
// authentication and authorization check (e.g., checking a user's Firebase session and custom claims).
function isAdminRequest(request: Request): boolean {
  // For this development environment, we will trust requests coming from the admin panel.
  // In a production scenario, you MUST implement proper auth checks here.
  const referer = request.headers.get('referer');
  // A simple check that the request is coming from the admin section of the app.
  return !!referer && new URL(referer).pathname.startsWith('/admin');
}

export async function POST(request: Request) {
  // A real application MUST have proper authentication and authorization here.
  // if (!isAdminRequest(request)) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  // }

  try {
    const data = await request.json();

    // Basic validation to ensure we're not writing garbage
    if (typeof data !== 'object' || !data.home || !data.about || !data.franchise) {
        return NextResponse.json({ message: 'Invalid content structure.' }, { status: 400 });
    }

    // Format the data into a TypeScript module string
    const fileContent = `
export const siteContentData = ${JSON.stringify(data, null, 2)};
`;

    const filePath = path.join(process.cwd(), 'src', 'lib', 'site-content.ts');
    const tempFilePath = `${filePath}.tmp`;

    // Atomically write the file to prevent race conditions with Next.js dev server
    await fs.writeFile(tempFilePath, fileContent.trim(), 'utf8');
    await fs.rename(tempFilePath, filePath);


    return NextResponse.json({ message: 'Content updated successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating content file:', error);
    return NextResponse.json({ message: 'Failed to write content file.', error: error.message }, { status: 500 });
  }
}
