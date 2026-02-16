import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import RealtimeBookmarks from '@/components/RealtimeBookmarks'
import SignOutButton from '@/components/SignOutButton'

export default async function Dashboard() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/')
    }

    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen p-8">
            <header className="flex justify-between items-center mb-12 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold">My Bookmarks</h1>
                <div className="flex items-center gap-4">
                    <span>{session.user.email}</span>
                    <SignOutButton />
                </div>
            </header>
            <main>
                <RealtimeBookmarks serverBookmarks={bookmarks || []} />
            </main>
        </div>
    )
}
