import { NextResponse } from 'next/server';

import { getRuntimeHealth } from '../../../../lib/runtime/ollama';

export async function GET() {
  const health = await getRuntimeHealth();

  return NextResponse.json(health);
}
