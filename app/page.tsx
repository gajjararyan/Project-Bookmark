import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthButton from '@/components/AuthButton'

export default async function Home() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
        redirect('/dashboard')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-8">Smart Bookmark App</h1>
            <p className="text-xl mb-8 text-center max-w-md">
                Save your links, access them anywhere, in real-time.
            </p>
            <AuthButton />
        </div>
    )
}
