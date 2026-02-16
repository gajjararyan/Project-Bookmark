'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import AddBookmark from './AddBookmark'
import BookmarkList from './BookmarkList'
import { useRouter } from 'next/navigation'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']

export default function RealtimeBookmarks({ serverBookmarks }: { serverBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(serverBookmarks)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Keep local state in sync with server state initially
        setBookmarks(serverBookmarks)
    }, [serverBookmarks])

    useEffect(() => {
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                async (payload) => {
                    // Refresh data or update local state manually
                    // Simple approach: router.refresh() to re-fetch server data + generic local updates
                    // But specific requirement: instant update.
                    // Let's implement optimistic/local updates based on payload.

                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) => prev.map(b => b.id === payload.new.id ? payload.new as Bookmark : b))
                    }

                    router.refresh()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router])

    return (
        <div className="max-w-2xl mx-auto w-full">
            <AddBookmark />
            <BookmarkList bookmarks={bookmarks} />
        </div>
    )
}
