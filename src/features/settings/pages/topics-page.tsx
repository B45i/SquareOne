import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { getSubjects } from '@/lib/db/subjects'
import { deleteTopic, getAllTopics } from '@/lib/db/topics'
import type { Topic } from '@/lib/firebase-types'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { TopicDialog } from '../components/topic-dialog'

function TopicCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-4 pb-4 px-4">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="mt-2 h-3 w-20 rounded" />
      </CardContent>
    </Card>
  )
}

export function TopicsPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Topic | undefined>()

  const { data: topics = [], isLoading: topicsLoading } = useQuery({
    queryKey: [QUERY_KEYS.topics],
    queryFn: getAllTopics,
  })

  const { data: subjects = [] } = useQuery({
    queryKey: [QUERY_KEYS.subjects],
    queryFn: getSubjects,
  })

  const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s]))

  const deleteMutation = useMutation({
    mutationFn: (topicId: string) => deleteTopic(topicId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.topics] }),
  })

  function openCreate() {
    setEditing(undefined)
    setDialogOpen(true)
  }

  function openEdit(topic: Topic) {
    setEditing(topic)
    setDialogOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <button
          onClick={openCreate}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 px-4 py-5 text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-colors min-h-[90px]"
        >
          <Plus className="size-5" />
          <span className="text-sm font-medium">Add Topic</span>
        </button>

        {topicsLoading
          ? Array.from({ length: 4 }).map((_, i) => <TopicCardSkeleton key={i} />)
          : topics.map(topic => {
            const subject = subjectMap[topic.subjectId]
            return (
              <Card key={topic.id} className="group">
                <CardContent className="">
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-semibold leading-tight">{topic.name}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 -mr-1 -mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(topic)}>
                          <Pencil className="size-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteMutation.mutate(topic.id)}
                          disabled={deleteMutation.isPending}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {subject && (
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {subject.emoji} {subject.name}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
      </div>

      <TopicDialog
        key={editing ? editing.id : dialogOpen ? 'new' : 'idle'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        topic={editing}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.topics] })}
      />
    </>
  )
}
