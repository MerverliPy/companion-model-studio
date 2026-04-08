import { NextResponse } from 'next/server';

import { listRuntimeModels } from '../../../../lib/runtime/ollama';

export async function GET() {
  const models = await listRuntimeModels();

  return NextResponse.json(models);
}
