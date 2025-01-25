import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';



export async function POST(req: NextRequest){   

    const supabase = await createClient()
    const user = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    

}