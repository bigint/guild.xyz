import { BigNumber } from "@ethersproject/bignumber"
import { Chain, Chains } from "connectors"
import useBalance from "hooks/useBalance"
import { PropsWithChildren, createContext, useContext } from "react"
import { GuildPlatform } from "types"

type Props = {
  roleId: number
  rolePlatformId: number
  guildPlatform: GuildPlatform
  chain: Chain
  address: string
  alreadyCollected: boolean
}

const CollectNftContext = createContext<Props>(undefined)

const CollectNftProvider = ({
  roleId,
  rolePlatformId,
  guildPlatform,
  chain,
  address,
  children,
}: PropsWithChildren<Omit<Props, "alreadyCollected">>) => {
  // TODO: use `hasTheUserIdClaimed` instead of `balanceOf`, so it shows `Already claimed` for other addresses of the user too
  const { tokenBalance: nftBalance } = useBalance(address, Chains[chain])
  const alreadyCollected = nftBalance?.gt(BigNumber.from(0))

  return (
    <CollectNftContext.Provider
      value={{
        roleId,
        rolePlatformId,
        guildPlatform,
        chain,
        address,
        alreadyCollected,
      }}
    >
      {children}
    </CollectNftContext.Provider>
  )
}

const useCollectNftContext = () => useContext(CollectNftContext)

export { CollectNftProvider, useCollectNftContext }
