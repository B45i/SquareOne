import { Controller, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SubjectCombobox } from '@/components/subject-combobox'
import { TopicCombobox } from '@/components/topic-combobox'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { startSession } from '@/lib/db/sessions'
import { QUERY_KEYS } from '@/lib/query-keys'
import type { SessionType } from '@/lib/firebase-types'

const schema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  topicId: z.string().min(1, 'Topic is required'),
  type: z.enum(['Learning', 'Practice', 'Revision']),
})

type FormValues = z.infer<typeof schema>

interface StartSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StartSessionDialog({ open, onOpenChange }: StartSessionDialogProps) {
  const queryClient = useQueryClient()

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { subjectId: '', topicId: '', type: 'Practice' },
  })

  const subjectId = useWatch({ control, name: 'subjectId' })

  const { mutate, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      startSession({ subjectId: values.subjectId, topicId: values.topicId, type: values.type as SessionType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.activeSession] })
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(v => mutate(v))} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label>Subject</Label>
            <Controller
              control={control}
              name="subjectId"
              render={({ field }) => (
                <SubjectCombobox
                  value={field.value}
                  onChange={id => { field.onChange(id); setValue('topicId', '') }}
                />
              )}
            />
            {errors.subjectId && <p className="text-sm text-destructive">{errors.subjectId.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Topic</Label>
            <Controller
              control={control}
              name="topicId"
              render={({ field }) => (
                <TopicCombobox value={field.value} onChange={field.onChange} subjectId={subjectId} />
              )}
            />
            {errors.topicId && <p className="text-sm text-destructive">{errors.topicId.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Learning">Learning</SelectItem>
                    <SelectItem value="Practice">Practice</SelectItem>
                    <SelectItem value="Revision">Revision</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Starting…' : 'Start Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
