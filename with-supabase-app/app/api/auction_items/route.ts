
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest){
    const supabase = await createClient()
    const { data, error } = await supabase.from('auction_items').select('*')
    if (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
    return NextResponse.json(data)
}

interface createAuctionItem {
    title: String
    description: String
    starting_price: Number
    end_time: Date
    min_increase? : Number
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


interface UpdateAuctionItem {
    title?: string
    description?: string
    starting_price?: number
    end_time?: string | Date
    min_increase?: number
    bidder_id?: string
    current_bid?: number
  }
  
  function buildUpdateObject(body: UpdateAuctionItem): Record<string, unknown> {
    const updateFields: Record<string, unknown> = {}
  
    if (body.title !== undefined) updateFields.title = body.title
    if (body.description !== undefined) updateFields.description = body.description
    if (body.starting_price !== undefined) updateFields.starting_bid = body.starting_price
    if (body.end_time !== undefined) {
      updateFields.countdown =
        typeof body.end_time === 'string'
          ? new Date(body.end_time).toISOString()
          : body.end_time.toISOString()
    }
    if (body.min_increase !== undefined) updateFields.min_increase = body.min_increase
    if (body.bidder_id !== undefined) updateFields.bidder = body.bidder_id
    if (body.current_bid !== undefined) updateFields.current_bid = body.current_bid
  
    return updateFields
  }
  
  
  export async function PATCH(req: NextRequest) {
    try {
      const supabase = await createClient()
      const {data :user,error: userError} = await supabase.auth.getUser()
  
      const id = req.nextUrl.searchParams.get('id')
  
      if (!user || userError) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
  
      // 2. Read the body
      const reqBody = (await req.json()) as UpdateAuctionItem
  
      // 3. Build the fields to update
      const updateData = buildUpdateObject(reqBody)
  
      // Edge case: if no fields are provided, no need to update
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { error: 'No valid fields provided for update' },
          { status: 400 }
        )
      }
  
      // 4. Perform the update
      //    In a typical REST approach, the `[id]` param is the auction item ID you want to update
      const { data, error } = await supabase
        .from('auction_items')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single()
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      if (!data) {
        return NextResponse.json(
          { error: 'Auction item not found or no update performed' },
          { status: 404 }
        )
      }
  
      return NextResponse.json(
        { message: 'Auction item updated successfully', data },
        { status: 200 }
      )
    } catch (err) {
      console.error(err)
      return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
  }