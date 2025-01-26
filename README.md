# National Bidders Of Canada
## Inspiration
With a thriving market valued at nearly [$20 billion](https://www.businessresearchinsights.com/market-reports/online-auction-market-103291), our vision is to connect millions globally through a dynamic live auction platform, empowering sellers and buyers to achieve growth and success anytime, anywhere.

## What it does
We developed a platform that connects individuals through live online auctions. National Bidders of Canada enables buyers and sellers to thrive by providing a seamless, user-friendly experience that bridges the gap between supply and demand. Our platform empowers users to participate in a dynamic marketplace designed to create opportunities and foster growth for all participants.
- Secure user authentication with email verification
- Admin page to list auction items with a set end date
- Listing page of all auctions retrieved from a PostgreSQL database
- Real time updating status of auctions, enabling users to engage in live bid wars and view past bids

## How we built it
Frontend: Next.js, Tailwind CSS, TypeScript
Backend: Supabase, TypeScript, OpenAI

## Challenges we ran into
Our biggest challenge was setting up WebSockets to enable real-time updates for the auctioned items. By implementing WebSocket technology, we created a seamless live auction experience, ensuring users could see up-to-the-moment statuses and engage dynamically with ongoing bids.

## Accomplishments that we're proud of
We're incredibly proud of what we accomplished as a team of three in just one weekend. Despite initial doubts, we implemented numerous features we hadn't thought possible within the time frame.

## What we learned
We learned a lot about creating our own API endpoints and listening for database event updates to update real time as changes occur.

## What's next for National Bidders of Canada
There were still many features we wanted to implement but didn't have the time to. With more time our next big feature would be notifications when you get outbid or when you win an auction.