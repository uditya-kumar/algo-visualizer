import { NextRequest, NextResponse } from 'next/server';
import { generateVisualization, NotDSAError } from '@/lib/bedrock';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    if (code.length > 10000) {
      return NextResponse.json(
        { error: 'Code is too long (max 10000 characters)' },
        { status: 400 }
      );
    }

    const visualization = await generateVisualization(code);
    return NextResponse.json(visualization);
  } catch (error) {
    console.error('Visualization error:', error);

    if (error instanceof NotDSAError) {
      return NextResponse.json(
        { error: error.message, type: 'not_dsa' },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error ? error.message : 'Failed to generate visualization';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
