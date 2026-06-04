import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { EmojiPickerButton } from '@/components/emoji-picker-button'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addSubject, updateSubject } from '@/lib/db/subjects'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  emoji: z.string(),
})

type FormValues = z.infer<typeof schema>

interface Subject {
  id: string
  name: string
  emoji: string
}

interface SubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject?: Subject
  onSuccess?: () => void
}

export function SubjectDialog({ open, onOpenChange, subject, onSuccess }: SubjectDialogProps) {
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: subject?.name ?? '', emoji: subject?.emoji ?? '' },
  })

  const emoji = useWatch({ control, name: 'emoji' })

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ name, emoji }: FormValues) => {
      if (subject) {
        await updateSubject(subject.id, { name, emoji })
      } else {
        await addSubject({ name, emoji, color: '' })
      }
    },
    onSuccess: () => {
      onSuccess?.()
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{subject ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(v => mutate(v))} className="flex flex-col gap-4 py-2">
          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-2">
              <Label>Emoji</Label>
              <EmojiPickerButton value={emoji} onChange={v => setValue('emoji', v)} />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label>Name</Label>
              <Input {...register('name')} placeholder="e.g. Algorithms" />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? subject ? 'Saving…' : 'Adding…'
                : subject ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
