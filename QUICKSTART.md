# CX Call Coaching - Quick Start

## Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What You'll See

A **single calm screen** with natural coaching guidance.

No emails. No chat history. No bullet lists.

Just paragraph-style guidance on what to say during the call.

## Key Principle

> The agent sees coaching, not context.

Email and chat messages are processed in the background to generate the guidance, but they're never shown to the agent.

## Architecture Highlights

- ✅ Natural language paragraphs (not bullet lists)
- ✅ Large readable typography
- ✅ Single-screen focus
- ✅ Zero cognitive overload
- ✅ Compliance-safe design

## Customization

**Change the guidance:**  
Edit `lib/ai-utils.ts` → `generateCoachingNarrative()`

**Test with new content:**  
Edit `lib/mock-data.ts`

**Adjust UI styling:**  
Edit `components/coaching-view.tsx`

## Production Build

```bash
npm run build
npm start
```

Built for real CX teams. Not a demo. 🎯
