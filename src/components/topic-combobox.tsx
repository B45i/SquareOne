import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Loader2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getTopicsBySubject, addTopic } from '@/lib/db/topics'
import { QUERY_KEYS } from '@/lib/query-keys'

interface TopicComboboxProps {
  value: string
  onChange: (id: string) => void
  subjectId: string
  disabled?: boolean
}

export function TopicCombobox({ value, onChange, subjectId, disabled }: TopicComboboxProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const { data: topics = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.topics, subjectId],
    queryFn: () => getTopicsBySubject(subjectId),
    enabled: !!subjectId,
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: (name: string) => addTopic({ name, subjectId }),
    onSuccess: (newId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.topics, subjectId] })
      onChange(newId)
      setQuery('')
      setOpen(false)
    },
  })

  const selected = topics.find(t => t.id === value)
  const filtered = query
    ? topics.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
    : topics
  const showCreate =
    !isCreating &&
    query.trim() !== '' &&
    !filtered.some(t => t.name.toLowerCase() === query.trim().toLowerCase())

  const isDisabled = disabled || !subjectId

  return (
    <Popover open={open} onOpenChange={isDisabled || isLoading ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={isDisabled}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {!subjectId
              ? 'Select a subject first'
              : isLoading
                ? 'Loading…'
                : selected
                  ? selected.name
                  : 'Select topic…'}
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
              <CommandEmpty>No topics yet — type to create one.</CommandEmpty>
            )}
            <CommandGroup>
              {filtered.map(topic => (
                <CommandItem
                  key={topic.id}
                  value={topic.id}
                  onSelect={() => { onChange(topic.id); setQuery(''); setOpen(false) }}
                >
                  <Check className={cn('mr-2 size-4 shrink-0', value === topic.id ? 'opacity-100' : 'opacity-0')} />
                  {topic.name}
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
