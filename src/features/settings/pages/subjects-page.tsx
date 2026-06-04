import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { deleteSubject, getSubjects } from '@/lib/db/subjects'
import type { Subject } from '@/lib/firebase-types'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { SubjectDialog } from '../components/subject-dialog'

function SubjectCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-5 pb-4 px-4">
        <Skeleton className="size-10 rounded-md" />
        <Skeleton className="mt-3 h-4 w-24 rounded" />
      </CardContent>
    </Card>
  )
}

export function SubjectsPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Subject | undefined>()

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.subjects],
    queryFn: getSubjects,
  })

  const deleteMutation = useMutation({
    mutationFn: (subjectId: string) => deleteSubject(subjectId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.subjects] }),
  })

  function openCreate() {
    setEditing(undefined)
    setDialogOpen(true)
  }

  function openEdit(subject: Subject) {
    setEditing(subject)
    setDialogOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <button
          onClick={openCreate}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 px-4 py-5 text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-colors min-h-[110px]"
        >
          <Plus className="size-5" />
          <span className="text-sm font-medium">Add Subject</span>
        </button>

        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SubjectCardSkeleton key={i} />)
          : subjects.map(subject => (
            <Card key={subject.id} className="group">
              <CardContent className="">
                <div className="flex items-start justify-between">
                  <span className="text-4xl leading-none select-none">{subject.emoji}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 -mr-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(subject)}>
                        <Pencil className="size-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteMutation.mutate(subject.id)}
                        disabled={deleteMutation.isPending}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-3 font-semibold leading-tight">{subject.name}</p>
              </CardContent>
            </Card>
          ))}
      </div>

      <SubjectDialog
        key={editing ? editing.id : dialogOpen ? 'new' : 'idle'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subject={editing}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.subjects] })}
      />
    </>
  )
}
