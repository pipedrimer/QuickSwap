import { useState } from "react"
import { ArrowRight, X } from "lucide-react"
import { Card, CardContent } from "./card"
// import { Input } from "@/components/ui/input"
// import { Separator } from "@/components/ui/separator"
interface TradeBuilderProps {
  selectedNFTs: Array<{
    id: string
    name: string
    collection: string
    image: string
    price: number
    currency: string
    traits: Array<{
      name: string
      value: string
      rarity: number
    }>
  }>
  onRemoveNFT: (id: string) => void
}




export const Trade = ({ selectedNFTs, onRemoveNFT }: TradeBuilderProps) => {
    

     const [yourNFTs, setYourNFTs] = useState(selectedNFTs)
  const [theirNFTs, setTheirNFTs] = useState<typeof selectedNFTs>([])
  const [additionalSOL, setAdditionalSOL] = useState("")

  const yourTotal = yourNFTs.reduce((sum, nft) => sum + nft.price, 0)
  const theirTotal = theirNFTs.reduce((sum, nft) => sum + nft.price, 0)
  const solDifference = additionalSOL ? Number.parseFloat(additionalSOL) : 0

  const moveToTheirs = (nft: (typeof selectedNFTs)[0]) => {
    setYourNFTs(yourNFTs.filter((item) => item.id !== nft.id))
    setTheirNFTs([...theirNFTs, nft])
  }

  const moveToYours = (nft: (typeof selectedNFTs)[0]) => {
    setTheirNFTs(theirNFTs.filter((item) => item.id !== nft.id))
    setYourNFTs([...yourNFTs, nft])
  }
    
    
    return  (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 p-4 z-20 w-3/5 h-2/3  text-black rounded-2xl shadow-2xl overflow-auto ">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Trade Builder</h2>
          <button
             
           className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
            onClick={() => {
              selectedNFTs.forEach((nft) => onRemoveNFT(nft.id))
            }}
          >
             &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Your Offer</h3>
              <span className="text-sm text-gray-400">Total: {yourTotal.toFixed(2)} SOL</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {yourNFTs.map((nft) => (
                <Card key={nft.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                  <div className="relative">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="w-full aspect-square object-cover"
                    />
                    <button
                      className="absolute top-1 right-1 h-6 w-6 bg-black/60 hover:bg-black/80 text-white"
                      onClick={() => moveToTheirs(nft)}
                    >
                      <ArrowRight className="h-3 w-3" />
                      <span className="sr-only">Move to their side</span>
                    </button>
                    <button
                      className="absolute top-1 left-1 h-6 w-6 bg-black/60 hover:bg-black/80 text-white"
                      onClick={() => onRemoveNFT(nft.id)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove from trade</span>
                    </button>
                  </div>
                  <CardContent className="p-2">
                    <p className="text-xs font-medium truncate" title={nft.name}>
                      {nft.name}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400 truncate" title={nft.collection}>
                        {nft.collection}
                      </p>
                      <p className="text-xs font-medium">{nft.price} SOL</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {yourNFTs.length === 0 && (
                <div className="col-span-full bg-gray-900 rounded-xl p-4 text-center text-gray-400 text-sm">
                  No NFTs selected for your side of the trade
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium mb-1 block">Add SOL to balance the trade</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="0.00"
                  className="bg-gray-900 border-gray-800 text-white"
                  value={additionalSOL}
                  onChange={(e) => setAdditionalSOL(e.target.value)}
                />
                <button  className="border-gray-800 text-white hover:bg-gray-800">
                  Add SOL
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Their Offer</h3>
              <span className="text-sm text-gray-400">Total: {theirTotal.toFixed(2)} SOL</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {theirNFTs.map((nft) => (
                <Card key={nft.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                  <div className="relative">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="w-full aspect-square object-cover"
                    />
                    <button
                     
                      
                      className="absolute top-1 left-1 h-6 w-6 bg-black/60 hover:bg-black/80 text-white"
                      onClick={() => moveToYours(nft)}
                    >
                      <ArrowRight className="h-3 w-3 transform rotate-180" />
                      <span className="sr-only">Move to your side</span>
                    </button>
                  </div>
                  <CardContent className="p-2">
                    <p className="text-xs font-medium truncate" title={nft.name}>
                      {nft.name}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400 truncate" title={nft.collection}>
                        {nft.collection}
                      </p>
                      <p className="text-xs font-medium">{nft.price} SOL</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {theirNFTs.length === 0 && (
                <div className="col-span-full bg-gray-900 rounded-xl p-4 text-center text-gray-400 text-sm">
                  No NFTs selected for their side of the trade
                </div>
              )}
            </div>
          </div>
        </div>

       <div className="shrink-0 bg-border h-[1px] w-full" />


        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Trade Value:</span>
              <span className="font-medium">
                {yourTotal.toFixed(2)} SOL
                {solDifference > 0 && ` + ${solDifference.toFixed(2)} SOL`}
              </span>
              <ArrowRight className="h-4 w-4 mx-1" />
              <span className="font-medium">{theirTotal.toFixed(2)} SOL</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {yourTotal + solDifference > theirTotal
                ? `You're offering ${(yourTotal + solDifference - theirTotal).toFixed(2)} SOL more`
                : theirTotal > yourTotal + solDifference
                  ? `They're offering ${(theirTotal - yourTotal - solDifference).toFixed(2)} SOL more`
                  : "Trade is balanced"}
            </p>
          </div>

          <div className="flex gap-3">
            <button  className="border-gray-800 text-white hover:bg-gray-800">
              Save as Draft
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 text-white">
              Create Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Trade