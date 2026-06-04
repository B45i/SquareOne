import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { finishSession } from '@/lib/db/sessions'
import type { Session, SessionDifficulty } from '@/lib/firebase-types'
import { QUERY_KEYS } from '@/lib/query-keys'

const schema = z.object({
  durationMinutes: z.number().int().min(1, 'At least 1 minute'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  notes: z.string().optional(),
  referenceLink: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface FinishSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: Session
  defaultDurationMinutes: number
}

export function FinishSessionDialog({ open, onOpenChange, session, defaultDurationMinutes }: FinishSessionDialogProps) {
  const queryClient = useQueryClient()

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      durationMinutes: defaultDurationMinutes,
      difficulty: 'Medium',
      notes: '',
      referenceLink: '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      finishSession({
        sessionId: session.id,
        subjectId: session.subjectId,
        topicId: session.topicId,
        date: session.date,
        durationMinutes: values.durationMinutes,
        difficulty: values.difficulty as SessionDifficulty,
        notes: values.notes?.trim() || null,
        referenceLink: values.referenceLink?.trim() || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.activeSession] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sessions] })
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finish Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(v => mutate(v))} className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Duration (minutes)</Label>
              <Input type="number" min={1} {...register('durationMinutes', { valueAsNumber: true })} />
              {errors.durationMinutes && (
                <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Difficulty</Label>
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Notes</Label>
            <Textarea placeholder="What did you cover?" rows={3} {...register('notes')} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Reference Link</Label>
            <Input type="url" placeholder="https://…" {...register('referenceLink')} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Finishing…' : 'Finish Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
