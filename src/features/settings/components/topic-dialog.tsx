import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { SubjectCombobox } from '@/components/subject-combobox'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addTopic, updateTopic } from '@/lib/db/topics'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  subjectId: z.string().min(1, 'Subject is required'),
})

type FormValues = z.infer<typeof schema>

interface Topic {
  id: string
  subjectId: string
  name: string
}

interface TopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  topic?: Topic
  onSuccess?: () => void
}

export function TopicDialog({ open, onOpenChange, topic, onSuccess }: TopicDialogProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: topic?.name ?? '', subjectId: topic?.subjectId ?? '' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ name, subjectId }: FormValues) => {
      if (topic) {
        await updateTopic(topic.id, { name, subjectId })
      } else {
        await addTopic({ name, subjectId })
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
          <DialogTitle>{topic ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(v => mutate(v))} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label>Subject</Label>
            <Controller
              control={control}
              name="subjectId"
              render={({ field }) => (
                <SubjectCombobox value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.subjectId && (
              <p className="text-sm text-destructive">{errors.subjectId.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input {...register('name')} placeholder="e.g. Closures" />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? topic ? 'Saving…' : 'Adding…'
                : topic ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
