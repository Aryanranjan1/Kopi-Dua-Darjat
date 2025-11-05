
import { NextResponse } from 'next/server';
import { syncInstagramPosts } from '@/app/api/[[...route]]/functions/instagram-sync';

export async function POST(request: Request) {
  try {
    const result = await syncInstagramPosts();
    if (result.status === 'error') {
      return NextResponse.json({ message: result.message }, { status: 500 });
    }
    return NextResponse.json({ message: `Synced ${result.count} posts.` });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
