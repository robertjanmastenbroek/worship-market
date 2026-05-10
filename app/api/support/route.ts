import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are a friendly, helpful support assistant for WorshipMarket — a verified marketplace for worship pads, sermon visuals, and creative services for churches and Kingdom creatives.

Key information about WorshipMarket:
- Creators sell worship pads, sermon visuals, motion backgrounds, and creative services
- All creators are human-verified and agree to a Statement of Faith
- Buyers can purchase digital products (instant download) and creative services (delivered within timeframe)
- Payment is handled securely via Stripe
- We support church leaders, worship pastors, and creative teams

Your role:
- Answer questions about how the platform works, pricing, product types, delivery, and account issues
- Help users find products or understand the verification process
- Keep responses concise, warm, and helpful — 2-4 sentences unless the question needs more detail
- If you genuinely cannot answer (e.g., account-specific issues, refund requests, technical bugs), respond with exactly: "ESCALATE: <brief reason why you can't help>"

Tone: Professional but warm, like a helpful church volunteer at an information desk. Do not be preachy — just helpful.`;

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, userEmail } = body as {
            messages: ChatMessage[];
            userEmail?: string;
        };

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.DEEPSEEK_API_KEY;

        if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
            // No API key configured — return a fallback response
            return NextResponse.json({
                reply: "Thanks for reaching out! Our support team will get back to you. In the meantime, you can browse the marketplace or check your dashboard for order updates.",
                needsHuman: true,
            });
        }

        // Call DeepSeek API (OpenAI-compatible)
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages,
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('DeepSeek API error:', response.status, errorText);
            return NextResponse.json({
                reply: "I'm having trouble connecting to our knowledge base right now. Please try again in a moment, or send us an email and we'll get back to you within 24 hours.",
                needsHuman: true,
            });
        }

        const data = await response.json();
        const aiReply = data.choices?.[0]?.message?.content || '';

        if (!aiReply) {
            return NextResponse.json({
                reply: "I didn't catch that — could you rephrase your question?",
                needsHuman: false,
            });
        }

        // Check if the AI is escalating to a human
        const isEscalation = aiReply.startsWith('ESCALATE:');
        const reply = isEscalation
            ? `This sounds like something our team should handle personally. ${userEmail ? `We'll get back to you at **${userEmail}** within 24 hours.` : "Please share your email so we can follow up with you."}`
            : aiReply;

        // If escalation and we have an email, log to Supabase support_tickets
        if (isEscalation && userEmail) {
            try {
                const { createClient } = await import('@supabase/supabase-js');
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
                );
                await supabase.from('support_tickets').insert({
                    email: userEmail,
                    question: messages[messages.length - 1]?.content || '',
                    ai_summary: aiReply.replace('ESCALATE:', '').trim(),
                    status: 'open',
                });
            } catch (logError) {
                console.error('Failed to log support ticket:', logError);
                // Non-fatal — the user still gets their reply
            }
        }

        return NextResponse.json({
            reply,
            needsHuman: isEscalation,
        });
    } catch (error: any) {
        console.error('Support API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', reply: "Something went wrong on our end. Please try again or email us directly." },
            { status: 500 }
        );
    }
}
