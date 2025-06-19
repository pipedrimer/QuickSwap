import { useState } from "react"
import { Check, Info } from "lucide-react"

import { Card, CardContent, CardFooter } from "../component/card"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../component/tooltip"

interface NFTCardProps {
  nft: {
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
  }
  selected: boolean
  onSelect: () => void
}

export function NFTCard({ nft, selected, onSelect }: NFTCardProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 bg-gray-900 border-gray-800 hover:border-purple-500/50 ${
        selected ? "ring-2 ring-purple-500" : ""
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-full aspect-square object-cover" />

        {/* Selection overlay */}
        <div
          className={`absolute inset-0 bg-purple-500/10 flex items-center justify-center transition-opacity duration-200 ${
            selected ? "opacity-100" : "opacity-0"
          }`}
        >
          {selected && (
            <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
          )}
        </div>

        {/* Action buttons overlay */}
        <div
          className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-200 ${
            isHovering && !selected ? "opacity-100" : "opacity-0"
          }`}
        >
          <button onClick={onSelect} className="bg-purple-600 hover:bg-purple-700 text-white">
            Select for Trade
          </button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-sm truncate" title={nft.name}>
            {nft.name}
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button  className="h-6 w-6 text-gray-400 hover:text-white">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">NFT Details</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="end" className="bg-gray-900 border-gray-800">
                <div className="space-y-2 p-1">
                  {nft.traits.map((trait) => (
                    <div key={trait.name} className="flex items-center justify-between gap-4 text-xs">
                      <span className="text-gray-400">{trait.name}:</span>
                      <div className="flex items-center gap-1">
                        <span>{trait.value}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          {trait.rarity}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-xs text-gray-400 truncate" title={nft.collection}>
          {nft.collection}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="font-medium">{nft.price}</span>
          <span className="text-sm text-gray-400">{nft.currency}</span>
        </div>
        <button
          
          className="h-8 px-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
          onClick={onSelect}
        >
          {selected ? "Deselect" : "Select"}
        </button>
      </CardFooter>
    </Card>
  )
}