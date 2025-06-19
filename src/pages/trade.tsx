import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs"
import { NFTCard } from "../component/nftcard"
import { Trade } from "../component/trade"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Button } from "../component/button"
// import { FilterSidebar } from "@/components/filter-sidebar"

// Mock data for NFT offers
const mockNFTs = [
  {
    id: "1",
    name: "Solana Monkey #1234",
    collection: "Solana Monkey Business",
    image: "/placeholder.svg?height=300&width=300",
    price: 45.5,
    currency: "SOL",
    traits: [
      { name: "Background", value: "Blue", rarity: 12 },
      { name: "Fur", value: "Gold", rarity: 3 },
    ],
  },
  {
    id: "2",
    name: "DeGod #5678",
    collection: "DeGods",
    image: "/placeholder.svg?height=300&width=300",
    price: 35.2,
    currency: "SOL",
    traits: [
      { name: "Background", value: "Red", rarity: 8 },
      { name: "Accessory", value: "Crown", rarity: 2 },
    ],
  },
  {
    id: "3",
    name: "Okay Bear #9012",
    collection: "Okay Bears",
    image: "/placeholder.svg?height=300&width=300",
    price: 58.7,
    currency: "SOL",
    traits: [
      { name: "Background", value: "Green", rarity: 15 },
      { name: "Outfit", value: "Suit", rarity: 5 },
    ],
  },
  {
    id: "4",
    name: "Degen Ape #3456",
    collection: "Degen Ape Academy",
    image: "/placeholder.svg?height=300&width=300",
    price: 22.3,
    currency: "SOL",
    traits: [
      { name: "Background", value: "Yellow", rarity: 10 },
      { name: "Eyes", value: "Laser", rarity: 4 },
    ],
  },
  {
    id: "5",
    name: "Aurory #7890",
    collection: "Aurory",
    image: "/placeholder.svg?height=300&width=300",
    price: 15.8,
    currency: "SOL",
    traits: [
      { name: "Background", value: "Purple", rarity: 7 },
      { name: "Weapon", value: "Sword", rarity: 6 },
    ],
  },
  {
    id: "6",
    name: "Solana Monkey #5678",
    collection: "Solana Monkey Business",
    image: "/placeholder.svg?height=300&width=300",
    price: 42.1,
    currency: "SOL",
    traits: [
      { name: "Background", value: "Orange", rarity: 9 },
      { name: "Hat", value: "Crown", rarity: 3 },
    ],
  },
]

export default function TradePage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedNFTs, setSelectedNFTs] = useState<typeof mockNFTs>([])
  const [isMounted, setIsMounted] = useState(false)

  // Only run client-side code after component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSelectNFT = (nft: (typeof mockNFTs)[0]) => {
    if (selectedNFTs.find((item) => item.id === nft.id)) {
      setSelectedNFTs(selectedNFTs.filter((item) => item.id !== nft.id))
    } else {
      setSelectedNFTs([...selectedNFTs, nft])
    }
  }

  // Don't render wallet-related components until client-side
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur-lg sticky top-0 z-10">
          <div className="container mx-auto py-4 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-400"></div>
                <span className="text-lg font-bold tracking-tight">QuickSwap</span>
              </div>
              <div className="h-9 w-32 bg-gray-800 rounded-md animate-pulse"></div>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-400"></div>
              <span className="text-lg font-bold tracking-tight">QuickSwap</span>
            </div>

            <div className="flex items-center gap-3">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* <FilterSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}

        <main className="flex-1">
          <div className="container mx-auto py-5 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
              <h1 className="text-2xl font-bold">Trade Dashboard</h1>

              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="Search collections or NFTs..."
                    className="pl-10 bg-gray-900 border-gray-800 text-white"
                  />
                </div>
                {/* <button
                 
                  className="border-gray-800 text-white hover:bg-gray-800"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button> */}
              </div>
            </div>

            <Tabs defaultValue="browse" className="mb-8">
              <TabsList className="bg-gray-900 border border-gray-800">
                <TabsTrigger value="browse" className="p-3 ">Browse Offers</TabsTrigger>
                <TabsTrigger value="my-offers" className="p-3">My Offers</TabsTrigger>
                <TabsTrigger value="history" className="p-3">Trade History</TabsTrigger>
              </TabsList>
              <TabsContent value="browse" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mockNFTs.map((nft) => (
                    <NFTCard
                      key={nft.id}
                      nft={nft}
                      selected={!!selectedNFTs.find((item) => item.id === nft.id)}
                      onSelect={() => handleSelectNFT(nft)}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="my-offers">
                <div className="bg-gray-900 rounded-2xl p-6 text-center">
                  <p className="text-gray-400 mb-3">Connect your wallet to view your offers</p>
                   
                   <WalletMultiButton />
                 
                </div>
              </TabsContent>
              <TabsContent value="history">
                <div className="bg-gray-900 rounded-2xl p-6 text-center">
                  <p className="text-gray-400 mb-3">Connect your wallet to view your trade history</p>
                  
                   <WalletMultiButton />
                 
                </div>
              </TabsContent>
            </Tabs>
{selectedNFTs.length > 0 && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
    {/* <p className="relative w-5/6 l bg-white text-black p-6 rounded-2xl shadow-2xl"> */}
      {/* Close Button */}
     
    <div className=" flex items-center   justify-center">
      {/* Trade Component */}
      <Trade
        selectedNFTs={selectedNFTs}
        onRemoveNFT={(id) =>
          setSelectedNFTs(selectedNFTs.filter((nft) => nft.id !== id))
        }
      />
      </div>
    {/* </p> */}
  </div>
)}

          </div>
        </main>
      </div>
    </div>
  )
}