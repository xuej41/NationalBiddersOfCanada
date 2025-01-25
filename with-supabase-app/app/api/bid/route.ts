import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';



interface createBid{
    auction_item_id: string,
    amount: number,
    created_at?: Date
}

async function isValid(data : any, user_id : string ,current_date : Date, amount :number): Promise<[boolean, any]> {

    if (!data ){
        return [false, NextResponse.json({ error: 'Auction item not found' }, { status: 404 })]
    }

    if (data.bidder_id === user_id){
        return [false, NextResponse.json({ error: 'You are already the highest bidder!' }, { status: 400 })]
    }

    if (data.current_bid >= amount){ 
        return [false, NextResponse.json({ error: 'Bid amount must be greater than current bid!' }, { status: 400 })]
    }

    if (data.current_bid + data.min_increase > amount){
        return [false, NextResponse.json({ error: 'Minimum bid threshold not met!' }, { status: 400 }
        )]
    }

    if (data.owner === user_id){
        return [false, NextResponse.json({ error: 'You Cannot Bid on Your Own Item!' }, { status: 400 })]
    }
    // console.log(data.countdown, current_date)

    if (new Date(data.countdown) < current_date){
        return [false, NextResponse.json({ error: 'Auction has ended!' }, { status: 400 })]
    }

    // console.log('works')

    return [true, null]
}

export async function POST(req: NextRequest){   

    const supabase = await createClient()
    const user = await supabase.auth.getUser()
    // console.log(user.data.user?.id)
    

    if (!user || !user.data.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reqBody = (await req.json()) as createBid

    if (!reqBody.auction_item_id){
        return NextResponse.json({ error: 'Auction item id is required' }, { status: 400 })
    }   
    if (!reqBody.amount){
        return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    const currentDate = new Date();

    const {data: data1, error: error1} = await supabase
    .from('auction_items')
    .select('*')
    .eq('id', reqBody.auction_item_id)
    .single()


    const confirmValidity = await isValid(data1, user.data.user.id, currentDate, reqBody.amount)
    if (!confirmValidity[0]){
        return confirmValidity[1]
    }   

    const { data, error } = await supabase
    .from('bids')
    .insert({
      auction_item_id: reqBody.auction_item_id,
      bidder_id: user.data.user?.id,
      amount: reqBody.amount,
      created_at: currentDate
    })
    .select('*') // return the inserted rows
    .single()  

    if (error) {
        // console.error('Error inserting bid:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const check = await onBid(reqBody.auction_item_id, user.data.user.id)
    if (check){
        return NextResponse.json({ message: 'Bid created' , data: data})    
    }
    return NextResponse.json({ error: 'Bid failed!' }, { status: 400 })
}

async function onBid(id : string, user_id : string){
    const supabase = await createClient()

    const { data, error } = await supabase
    .from('bids')
    .select('*')
    .eq('auction_item_id', id)
    .order('amount', { ascending: false })   // highest amount first
    .order('created_at', { ascending: true }) // within ties, earliest created_at first
    .limit(1)                                 // only need the single top earliest row
    .single()

    if (error) {
        // console.error('Error getting bids:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const res = await fetch(`http://localhost:3000/api/auction_items/?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bidder_id : data.bidder_id,
            current_bid : data.amount,
        }),
      });
    

    console.log(data)
    return data.bidder_id === user_id
}