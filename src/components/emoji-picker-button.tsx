import { useState } from 'react'
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface EmojiPickerButtonProps {
  value: string
  onChange: (emoji: string) => void
}

export function EmojiPickerButton({ value, onChange }: EmojiPickerButtonProps) {
  const [open, setOpen] = useState(false)

  function handleSelect(data: EmojiClickData) {
    onChange(data.emoji)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="size-10 p-0 text-xl">
          {value || '📚'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" side="right" align="start">
        <EmojiPicker onEmojiClick={handleSelect} height={400} />
      </PopoverContent>
    </Popover>
  )
}
