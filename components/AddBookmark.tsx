'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AddBookmark() {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !url) return

        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { error } = await supabase.from('bookmarks').insert({
                title,
                url,
                user_id: user.id,
            })

            if (error) {
                console.error('Error adding bookmark:', error)
                alert('Error adding bookmark')
            } else {
                setTitle('')
                setUrl('')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-bold mb-4">Add New Bookmark</h2>
            <div className="flex flex-col space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., My Favorite Blog"
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                    required
                />
            </div>
            <div className="flex flex-col space-y-2">
                <label htmlFor="url" className="text-sm font-medium">URL</label>
                <input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
            >
                {loading ? 'Adding...' : 'Add Bookmark'}
            </button>
        </form>
    )
}
