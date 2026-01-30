# CX Call Coaching System

A clean, single-screen coaching tool for customer service agents. Built with Next.js 15, React, TypeScript, and shadcn/ui.

## Philosophy

**This is not a reference screen. It's a coaching screen.**

Agents never see raw emails or internal chat messages. They see only what to say, how to say it, and what not to mess up. The UI converts backend context into natural, spoken guidance that flows like a real conversation.

## Core Principle

> Email and chat are **input-only** sources.  
> The agent sees **only coaching guidance**, nothing else.

This architecture:
- Reduces cognitive overload during live calls
- Prevents agents from misreading internal content  
- Ensures compliance in sensitive environments
- Scales naturally to voice assistants and scripts

## Features

### Natural Language Coaching
- No bullet lists or system headings
- Short paragraphs with natural flow
- Written exactly how an agent thinks during a call
- Large, readable typography optimized for live use

### Example Guidance Style

Instead of showing:
```
❌ "Step 1: Verify customer identity"
❌ "Check documents: passport, visa, tickets"
```

The system generates:
```
✅ "Start by welcoming the customer and confirming you're calling about 
   their upcoming Dubai trip. Let them know their vouchers are ready 
   and active on the Pickyourtrail app."

✅ "Walk through the essential documents they'll need to carry. Remind 
   them to bring both original passports and printed copies..."
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home (redirects to /call-coaching)
│   ├── globals.css             # Global styles
│   └── call-coaching/
│       └── page.tsx            # Main coaching page
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── scroll-area.tsx
│   └── coaching-view.tsx       # Single coaching component
├── lib/
│   ├── utils.ts                # Utility functions
│   ├── ai-utils.ts             # AI coaching generation
│   └── mock-data.ts            # Sample email/chat (never displayed)
└── [config files]
```

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### Setup Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

The app will automatically redirect to `/voucher-prep`.

## Usage

Visit `http://localhost:3000` and you'll see a single coaching screen. 

The UI shows natural language guidance generated from:
- Travel confirmation email (processed in background)
- Internal team chat messages (processed in background)

**The agent never sees the raw email or chat.**

### What Agents See
- Clean, calm single-screen interface
- Natural paragraph-style coaching guidance
- Large, readable typography
- Scrollable content for complete guidance
- Customer name at top for context

### What Agents Don't See
- ❌ Raw email HTML
- ❌ Internal chat messages
- ❌ System metadata
- ❌ Bullet-point checklists
- ❌ Technical jargon

## AI Integration

Currently uses **mock AI logic** for demonstration. To integrate real AI:

### OpenAI Integration
```typescript
// In lib/ai-utils.ts
import OpenAI from 'openai';

export async function generateCallGuidance(
  emailContent: string,
  chatMessages?: Array<any>
): Promise<CallCoachingGuidance> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const systemPrompt = `You are a call coaching assistant. 
Convert this email and chat context into natural, paragraph-style guidance 
for a customer service agent. Use conversational language as if you're 
coaching someone on what to say during a live call. No bullet points, 
no headings, just flowing natural paragraphs.`;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Email: ${emailContent}\n\nChat: ${JSON.stringify(chatMessages)}` }
    ],
  });
  
  // Parse and structure the response
  const narrative = response.choices[0].message.content?.split('\n\n') || [];
  return { narrative };
}
```

### Anthropic Claude Integration
```typescript
import Anthropic from '@anthropic-ai/sdk';

export async function generateCallGuidance(
  emailContent: string,
  chatMessages?: Array<any>
): Promise<CallCoachingGuidance> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  
  const message = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 2048,
    messages: [{
      role: "user",
      content: `Convert this travel email into natural call coaching guidance.
      Write it as flowing paragraphs, like you're coaching an agent on what
      to say during the call. No bullets, no lists.\n\n${emailContent}`
    }],
  });
  
  const narrative = message.content[0].text.split('\n\n');
  return { narrative };
}
```

## Customization

### Modify Coaching Output
Edit the `generateCoachingNarrative` function in [lib/ai-utils.ts](lib/ai-utils.ts) to adjust guidance style.

### Update Mock Data
Edit [lib/mock-data.ts](lib/mock-data.ts) to test with different email/chat content.

### Adjust Typography
Modify font sizes, spacing, and colors in [components/coaching-view.tsx](components/coaching-view.tsx).

### Change Customer Name
Pass different values to the `customerName` prop in the main page component.

## Security Considerations

- Email/chat content never exposed to agent view
- All processing happens server-side or in background
- Use environment variables for API keys
- Implement proper authentication for production
- Add rate limiting for AI API calls
- Consider audit logging for compliance

## Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel (recommended)
vercel deploy
```

## Environment Variables

For AI integration, create a `.env.local` file:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# or Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# or Custom AI endpoint
CUSTOM_AI_API_URL=https://your-api.com/coaching
```

## Why This Architecture Works

### For Agents
- Zero cognitive overload during calls
- No risk of reading internal messages out loud
- Natural conversation flow guidance
- Easy to scan during live interactions

### For Organizations
- Compliance-safe (no raw data exposure)
- Consistent coaching across team
- Easier quality assurance
- Scalable to voice AI assistants

### For Product Teams
- Clean separation of concerns
- Easy to A/B test coaching styles
- Simple to add new data sources
- ML-ready architecture

## Future Enhancements

- [ ] Real-time email webhook integration
- [ ] Voice-to-text for live call assist
- [ ] Multi-language coaching generation
- [ ] Tone adjustment (formal/casual/empathetic)
- [ ] Custom coaching templates per use case
- [ ] Analytics: track which guidance correlates with better outcomes
- [ ] Mobile-optimized view
- [ ] Offline mode with cached guidance

## Design Philosophy

This tool is built like a **senior CX org** would design it:

1. **Agent-first thinking** - Optimized for live call usage
2. **Compliance by design** - No raw data exposure
3. **Natural language** - Coaches, doesn't dictate
4. **Production-ready** - Not a demo, a real tool

Perfect for:
- Customer service teams
- Sales coaching
- Support escalations  
- Compliance-heavy industries
- Voice assistant training

## License

MIT License - feel free to use for your projects!

## Support

For issues or questions, please create an issue in the repository.
