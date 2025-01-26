import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';



export async function GET(req : NextRequest) {

    const supabase = await createClient()
    const user = await supabase.auth.getUser()

    if (!user || !user.data.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.data.user.id).single()
    if (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
    return NextResponse.json(data)

}