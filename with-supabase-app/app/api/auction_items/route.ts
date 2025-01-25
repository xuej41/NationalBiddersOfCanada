
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest){
    const id = req.nextUrl.searchParams.get('id')
    const supabase = await createClient()

    if (id){
        const { data, error } = await supabase.from('auction_items').select('*').eq('id', id).single()
        if (error) {
            return NextResponse.json({ error: error }, { status: 500 })
        }
        return NextResponse.json(data)
    }
    const { data, error } = await supabase.from('auction_items').select('*')
    if (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
    return NextResponse.json(data)
}

interface createAuctionItem {
    title: String
    description: String
    starting_price: number
    end_time: Date
    min_increase? : number
}

export async function POST(req: NextRequest){
    // const sessionCookie = req.cookies.get('session-token')
    // if (!sessionCookie) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    //   }

    const supabase = await createClient()
    const user = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const reqBody = (await req.json()) as createAuctionItem

    if (!reqBody.title){
        return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!reqBody.description){
        return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    }
    if (!reqBody.starting_price){
        return NextResponse.json({ error: 'Starting price is required' }, { status: 400 })
    }
    if (!reqBody.end_time){
        return NextResponse.json({ error: 'End time is required' }, { status: 400 })
    }

    if (reqBody.starting_price < 0){
        return NextResponse.json({ error: 'Starting price cannot be negative' }, { status: 400 })
    }

    if (reqBody.min_increase && reqBody.min_increase < 0){
        return NextResponse.json({ error: 'Minimum increase cannot be negative' }, { status: 400 })
    }

    if (new Date(reqBody.end_time) < new Date()){
        return NextResponse.json({ error: 'End time must be in the future' }, { status: 400 })
    }


    const { data, error } = await supabase
    .from('auction_items')
    .insert({
      title: reqBody.title,
      description: reqBody.description,
      starting_bid: reqBody.starting_price,
      countdown: reqBody.end_time,
      min_increase : reqBody.min_increase ? reqBody.min_increase : 5
    })
    .select('*') 

  if (error) {
    console.error('Error inserting auction item:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

    return NextResponse.json({ message: 'Auction item created' , data: reqBody})    

}

