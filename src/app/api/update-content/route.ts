
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (typeof data !== 'object' || !data.en || !data.ms) {
        return NextResponse.json({ message: 'Invalid content structure. Expecting "en" and "ms" keys.' }, { status: 400 });
    }

    const fileContentEn = `export const siteContentData = ${JSON.stringify(data.en, null, 2)};`;
    const fileContentMs = `export const siteContentDataMs = ${JSON.stringify(data.ms, null, 2)};`;

    const filePathEn = path.join(process.cwd(), 'src', 'lib', 'site-content.ts');
    const filePathMs = path.join(process.cwd(), 'src', 'lib', 'site-content-ms.ts');
    
    const tempFilePathEn = `${filePathEn}.tmp`;
    const tempFilePathMs = `${filePathMs}.tmp`;

    // Atomically write both files
    await fs.writeFile(tempFilePathEn, fileContentEn.trim(), 'utf8');
    await fs.rename(tempFilePathEn, filePathEn);
    
    await fs.writeFile(tempFilePathMs, fileContentMs.trim(), 'utf8');
    await fs.rename(tempFilePathMs, filePathMs);

    return NextResponse.json({ message: 'Content updated successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating content file:', error);
    return NextResponse.json({ message: 'Failed to write content file.', error: error.message }, { status: 500 });
  }
}
