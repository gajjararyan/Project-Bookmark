'use client'

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']

export default function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
    const supabase = createClient()

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            console.error('Error deleting bookmark:', error)
            alert('Error deleting bookmark')
        }
    }

    if (bookmarks.length === 0) {
        return <p className="text-center text-gray-500">No bookmarks yet. Add one above!</p>
    }

    return (
        <ul className="space-y-4">
            {bookmarks.map((bookmark) => (
                <li key={bookmark.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow flex justify-between items-center group">
                    <div className="flex-1 min-w-0 mr-4">
                        <h3 className="text-lg font-semibold truncate hover:text-indigo-600 transition-colors">
                            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                                {bookmark.title}
                            </a>
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
                    </div>
                    <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Delete bookmark"
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    )
}
