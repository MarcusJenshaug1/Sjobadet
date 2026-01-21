import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const runId = request.nextUrl.searchParams.get('runId');
    if (!runId) {
        return NextResponse.json({ error: 'Missing runId' }, { status: 400 });
    }

    // Create a TransformStream for SSE
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    let isClosed = false;

    // Function to write SSE event
    const sendEvent = async (data: any) => {
        if (isClosed) return;
        try {
            const message = `data: ${JSON.stringify(data)}\n\n`;
            await writer.write(encoder.encode(message));
        } catch (e) {
            isClosed = true;
            console.error('Error writing to stream', e);
        }
    };

    // Start polling mechanism
    const startPolling = async () => {
        let lastEventId: string | undefined = undefined; // Start from beginning or handle 'Last-Event-ID' header if sent

        // Initial connection message
        await sendEvent({ type: 'connected', runId });

        const pollInterval = setInterval(async () => {
            if (isClosed) {
                clearInterval(pollInterval);
                return;
            }

            try {
                const whereClause: any = { runId };
                if (lastEventId) {
                    // Assuming ids are roughly chronological CUIDs/UUIDs or use createdAt
                    // Using createdAt is safer if IDs are not sortable, but CUIDs are time-sortable generally.
                    // Let's rely on createdAt for simplicity if we can specific millisecond precision,
                    // but ID gt is better if we store chronological IDs.
                    // For simplicity, let's fetch new events created after the last fetch timestamp roughly.
                    // Or better, track "processed" IDs. But that's heavy.
                    // We'll use the hack of "createdAt > lastFetchedTime".
                    // Actually, let's use `cursor` if we had one.
                }

                // To properly stream, we need to track what we've sent.
                // A simple approach for low volume: fetch all events for the run, filter by what we haven't sent.
                // But that scales poorly.
                // Better: client sends `lastEventId` header? No, this is server-push.
                // We keep track of `lastCheckedTime` in closure.

                // Standard approach:
                // 1. Fetch recent events
                // 2. Filter out duplicates (if any)
                // 3. Send

                // Refined approach:
                // Fetch events where createdAt > lastCheckedTime
            } catch (error) {
                console.error('Polling error', error);
                await sendEvent({ type: 'error', message: 'Polling failed' });
            }
        }, 2000);

        // Keep connection alive for a max duration or until client disconnects (handled by catch)
        // Next.js might kill it after timeout.

        // NOTE: This simple implementation is tricky due to serverless timeouts.
        // A robust production app relies on external PubSub (Redis/Supabase Realtime).
        // Given the constraints and existing stack (Supabase), we COULD use Supabase Realtime client side.
        // But the requirements asked for "GET /stream".
        // We will implement a simplified poller here that just sends "ping" for now or
        // relies on the CLIENT polling the list endpoint if this proves too unstable.

        // ACTUAL IMPLEMENTATION for Vercel/Node environment:
        // We will assume the client will reconnect if stream dies.
        // We'll track `lastCreatedAt`.

        let lastCreatedAt = new Date(0);

        // Query initial logs to catch up? 
        // Usually the client loads the page, fetches ALL existing logs via REST API, then connects to stream for NEW ones.
        // So we primarily want NEW logs.

        // Set lastCreatedAt to NOW - 5 seconds to catch anything just happened
        lastCreatedAt = new Date(Date.now() - 5000);

        const interval = setInterval(async () => {
            if (isClosed) {
                clearInterval(interval);
                return;
            }

            try {
                const newEvents = await prisma.scrapeLogEvent.findMany({
                    where: {
                        runId,
                        createdAt: { gt: lastCreatedAt }
                    },
                    orderBy: { createdAt: 'asc' }
                });

                if (newEvents.length > 0) {
                    lastCreatedAt = newEvents[newEvents.length - 1].createdAt;
                    for (const event of newEvents) {
                        await sendEvent({ type: 'log', data: event });
                    }
                }

                // Check run status to see if finished
                const run = await prisma.scrapeRun.findUnique({
                    where: { id: runId },
                    select: { status: true }
                });

                if (run && ['success', 'failed', 'partial', 'cancelled'].includes(run.status)) {
                    await sendEvent({ type: 'status', status: run.status });
                    await sendEvent({ type: 'done' });
                    clearInterval(interval);
                    writer.close();
                    isClosed = true;
                }

            } catch (e) {
                // ignore
            }
        }, 1000);

        // Cleanup on disconnect logic is hard to detect in some serverless modes without request.signal
        // request.signal.onabort = () => { isClosed = true; clearInterval(interval); writer.close(); };
        request.signal.addEventListener('abort', () => {
            isClosed = true;
            clearInterval(interval);
            writer.close();
        });
    };

    startPolling();

    return new NextResponse(stream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
