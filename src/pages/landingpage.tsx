import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { IconArrowRight, IconPlayerPlay } from '@tabler/icons-react'
import '@solana/wallet-adapter-react-ui/styles.css'
type cardType = {
  id: number
  title: string
  description: string
  imgURL: string
}

export const LandingPage = () => {
  return (
    <>
      <header className="py-[24px]">
        <nav className="flex justify-between items-center px-[200px] text-white">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#9333EA] to-[#22D3EE] rounded-xl size-[40px]"></div>
            <h1 className="text-xl font-bold">QuickSwap</h1>
          </div>
          <ul className="flex gap-[30px] text-sm text-[#D1D5DB]">
            <li>How it works</li>
            <li>Trade</li>
            <li>Docs</li>
          </ul>
          <WalletMultiButton />
        </nav>
      </header>
      <main>
        <section className="flex flex-col text-center items-center justify-center gap-[24px] h-[calc(100vh-100px)]">
          <h1 className="w-[768px] text-6xl font-bold bg-gradient-to-r from-[#A855F7] via-[#22D3EE] to-[#4ADE80] bg-clip-text text-transparent">
            Barter NFTs. No middlemen. No limits.
          </h1>
          <p className="w-[672px] text-xl font-normal">
            QuickSwap is the first decentralized NFT barter marketplace on Solana. Trade NFTs directly, add SOL or USDC,
            and enjoy trustless escrow — all in one place.
          </p>
          <div className="flex gap-[16px] mt-[16px]">
            <button className="flex gap-4 items-center bg-gradient-to-r from-[#9333EA] to-[#22D3EE] rounded-[10px] px-[32px] py-[14px]">
              <p className="font-medium text-sm">Try Demo</p>
              <IconArrowRight />
            </button>
            <button className="flex gap-4 items-center border border-[#A855F7] rounded-[10px] px-[32px] py-[14px]">
              <p className="font-medium text-sm">Learn How It Works</p>
              <IconPlayerPlay />
            </button>
          </div>
        </section>
        {/* this is the section for the nft */}
        <section className="flex flex-col items-center justify-center bg-[#030712] px-[120px] py-[40px] gap-[32px]">
          <div className="text-center">
            <h3 className="text-[30px] font-bold">How It Works</h3>
            <p className="font-light text-base w-[600px] text-[#9CA3AF]">
              QuickSwap makes NFT trading simple, secure, and completely decentralized. No intermediaries, no custody
              risks, just pure peer-to-peer trading.
            </p>
          </div>
          <div className="grid gap-[24px] items-center grid-cols-4">
            {how_it_works.map(({ id, title,description,imgURL }: cardType) => (
              <div key={id} className="w-[250px] bg-[#1F2937] p-[25px] rounded-xl">
                <img src={imgURL} alt={title}/>
                <h6 className="font-bold text-base my-2">{title}</h6>
                <p className='text-[#9CA3AF] text-xs'>{description}</p>
              </div>
            ))}
          </div>
          <div></div>
        </section>
      </main>
      <footer></footer>
    </>
  )
}

const how_it_works = [
  {
    id: 1,
    imgURL:'/swaps.png',
    title: 'NFT-for-NFT Swaps',
    description: 'Trade any NFT for any other NFT directly. No wrapping, no listing fees, no complications.',
  },
  {
    id: 2,
    imgURL:'/trades.png',
    title: 'Hybrid Trades',
    description: "Add SOL or USDC to balance your trades. Perfect when NFT values don't match exactly.",
  },
  {
    id: 3,
    imgURL:'/trustless.png',
    title: 'Trustless Escrow',
    description: 'Assets are locked in a secure smart contract until both parties confirm the trade.',
  },
  {
    id: 4,
    imgURL:'/verified.png',
    title: 'Verified Collections',
    description: 'Trade with confidence. Only verified collections are supported to prevent scams.',
  },
]
