'use client';

import { MoveDown } from 'lucide-react';

export default function ScrollArrow() {
  return (
    <button type="button" className="scroll-cue" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
      <MoveDown size={18} strokeWidth={2} />
      Scroll
    </button>
  );
}
