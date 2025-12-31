// ============================================
// FloatingActionTool.tsx
// ============================================

import React, { useState, useRef } from 'react'
import { Button } from '../ui/button';
import { ArrowRight, Sparkles, X } from 'lucide-react';

type Props = {
  position: { x: number, y: number } | null
  onClose: () => void,
  handleAiChange: (prompt: string) => void
}

function FloatingActionTool({ position, onClose, handleAiChange }: Props) {
  const [userPrompt, setUserPrompt] = useState<string>('')
  const toolRef = useRef<HTMLDivElement>(null)

  // Early return if no position
  if (!position) {
    return null;
  }

  const handleSubmit = () => {
    if (userPrompt.trim()) {
      handleAiChange(userPrompt);
      setUserPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Calculate safe position to keep tool in viewport
  const getSafePosition = () => {
    if (!toolRef.current) {
      return {
        top: position.y + 8,
        left: position.x,
        transform: "translateX(-50%)"
      }
    }

    const toolRect = toolRef.current.getBoundingClientRect()
    const toolWidth = toolRect.width
    const toolHeight = toolRect.height
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const padding = 10

    let top = position.y + 8
    let left = position.x
    let transform = "translateX(-50%)"

    // Check horizontal bounds
    const leftEdge = left - toolWidth / 2
    const rightEdge = left + toolWidth / 2

    if (leftEdge < padding) {
      left = padding
      transform = "translateX(0)"
    } else if (rightEdge > viewportWidth - padding) {
      left = viewportWidth - padding
      transform = "translateX(-100%)"
    }

    // Check vertical bounds
    if (top + toolHeight > viewportHeight - padding) {
      top = position.y - toolHeight - 8
    }

    if (top < padding) {
      top = padding
    }

    return { top, left, transform }
  }

  const safePosition = getSafePosition()

  return (
    <div 
      ref={toolRef}
      className='fixed z-[9999] bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-xl border border-gray-600 flex gap-2 items-center'
      style={{
        top: `${safePosition.top}px`,
        left: `${safePosition.left}px`,
        transform: safePosition.transform
      }}
    >
      <Sparkles className='h-4 w-4 text-yellow-400' />
      <input 
        type="text" 
        placeholder='Edit with AI' 
        value={userPrompt}
        className='outline-none bg-transparent border-none text-white placeholder-gray-400 min-w-[200px]'
        onChange={(event) => setUserPrompt(event.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <Button 
        variant={'ghost'} 
        size={'icon-sm'} 
        onClick={handleSubmit}
        className='hover:bg-gray-700'
        disabled={!userPrompt.trim()}
      >
        <ArrowRight className='h-4 w-4' />
      </Button>
      <Button 
        variant={'ghost'} 
        size={'icon-sm'} 
        onClick={onClose}
        className='hover:bg-gray-700'
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  )
}

export default FloatingActionTool