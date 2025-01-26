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

    console.log(data.bidder, user_id)

    if (data.bidder === user_id){
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

    const {data : userInfo, error: userError} = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.data.user.id).single()

    if (userError) {
        return NextResponse.json({ error: userError }, { status: 500 })
    }   

    if (userInfo.balance < reqBody.amount){ 
        return NextResponse.json({ error: 'Insufficient balance!' }, { status: 400 })
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

    const res = await update({bidder_id: user_id, current_bid: data.amount}, id)
    

    console.log(data)
    return data.bidder_id === user_id
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
  
  
async function update(params : UpdateAuctionItem, id: string) {
    try {
      const supabase = await createClient()


      const { data: auctionItem, error: auctionItemError } = await supabase
      .from('auction_items')
      .select('*')
        .eq('id', id)
        .single()

        if (auctionItemError) {
            return NextResponse.json({ error: auctionItemError }, { status: 500 })
        }


  
      // 3. Build the fields to update
      const updateData = buildUpdateObject(params)
  
      // Edge case: if no fields are provided, no need to update
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { error: 'No valid fields provided for update' },
          { status: 400 }
        )
      }

      const bidder = auctionItem.bidder
      const current_bid = auctionItem.current_bid
      
      // 1. Fetch the current balances for this user (so we know the latest values)
      let { data: profile, error : profileFail } = await supabase
        .from('profiles')
        .select('balance, locked_balance')
        .eq('id', bidder)
        .single()
      
      if (profileFail) {
        console.error('Error fetching profile:', profileFail)
        return
      }
      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }
      
      // 2. Calculate the new values
      const newLocked = profile.locked_balance - current_bid
      const newBalance = profile.balance + current_bid
      
      // 3. Update the profile
      let { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({
          locked_bal: newLocked,
          balance: newBalance
        })
        .eq('id', bidder)
        .single()
      
      if (updateError) {
        console.error('Error updating profile:', updateError)
      } else {
        console.log('Profile updated:', updated)
      }
      
      // update old profile

      const { data: profile2, error : profileFail2 } = await supabase
      .from('profiles')
      .select('balance, locked_balance')
        .eq('id', params.bidder_id).single()
    
        if (profileFail2) {
            console.error('Error fetching profile:', profileFail2)
            return NextResponse.json({ error: profileFail2 }, { status: 500 })
        }
        if (!profile2) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
    
        // 2. Calculate the new values
        const newLocked2 = profile2.balance + auctionItem.current_bid;
        const newBalance2 = profile2.locked_balance - auctionItem.current_bid;

        // 3. Update the profile
        let { data: updated2, error: updateError2 } = await supabase
        .from('profiles')
        .update({
          locked_bal: newLocked2,
          balance: newBalance2
        })
        .eq('id', params.bidder_id)
        .single()

        if (updateError2) {
            console.error('Error updating profile:', updateError2)
        } else {
            console.log('Profile updated:', updated2)
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