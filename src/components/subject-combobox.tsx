import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Loader2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getSubjects, addSubject } from '@/lib/db/subjects'
import { QUERY_KEYS } from '@/lib/query-keys'

interface SubjectComboboxProps {
  value: string
  onChange: (id: string) => void
  disabled?: boolean
}

export function SubjectCombobox({ value, onChange, disabled }: SubjectComboboxProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.subjects],
    queryFn: getSubjects,
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: (name: string) => addSubject({ name, emoji: '✏️', color: '' }),
    onSuccess: (newId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.subjects] })
      onChange(newId)
      setQuery('')
      setOpen(false)
    },
  })

  const selected = subjects.find(s => s.id === value)
  const filtered = query
    ? subjects.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
    : subjects
  const showCreate =
    !isCreating &&
    query.trim() !== '' &&
    !filtered.some(s => s.name.toLowerCase() === query.trim().toLowerCase())

  return (
    <Popover open={open} onOpenChange={disabled || isLoading ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled || isLoading}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {isLoading
              ? 'Loading…'
              : selected
                ? `${selected.emoji} ${selected.name}`
                : 'Select subject…'}
          </span>
          {isLoading
            ? <Loader2 className="ml-2 size-4 shrink-0 animate-spin opacity-50" />
            : <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search or create…" value={query} onValueChange={setQuery} />
          <CommandList>
            {filtered.length === 0 && !showCreate && (
              <CommandEmpty>No subjects found.</CommandEmpty>
            )}
            <CommandGroup>
              {filtered.map(subject => (
                <CommandItem
                  key={subject.id}
                  value={subject.id}
                  onSelect={() => { onChange(subject.id); setQuery(''); setOpen(false) }}
                >
                  <Check className={cn('mr-2 size-4 shrink-0', value === subject.id ? 'opacity-100' : 'opacity-0')} />
                  {subject.emoji} {subject.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {showCreate && (
              <CommandGroup>
                <CommandItem
                  value={`__create__${query}`}
                  onSelect={() => create(query.trim())}
                >
                  <Plus className="mr-2 size-4 shrink-0" />
                  Create "{query.trim()}"
                </CommandItem>
              </CommandGroup>
            )}
            {isCreating && (
              <CommandGroup>
                <CommandItem disabled value="__creating__">
                  <Loader2 className="mr-2 size-4 shrink-0 animate-spin" />
                  Creating…
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
