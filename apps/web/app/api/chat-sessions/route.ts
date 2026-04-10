import { NextResponse } from 'next/server';

import {
  getActiveChatSession,
  saveActiveChatSession,
} from '../../../lib/chat/chat-session-repository';
import { isChatSession } from '../../../lib/chat/session-store';

export async function GET() {
  const session = await getActiveChatSession();

  return NextResponse.json({ session });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!isChatSession(body)) {
    return NextResponse.json({ error: 'Invalid chat session payload.' }, { status: 400 });
  }

  const session = await saveActiveChatSession(body);

  return NextResponse.json({ session }, { status: 201 });
}
