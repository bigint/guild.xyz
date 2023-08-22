import { BigNumber } from "@ethersproject/bignumber"
import { GUILD_REWARD_NFT_FACTORY_ADDRESSES } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import { Chain } from "connectors"
import useContract from "hooks/useContract"
import GUILD_REWARD_NFT_FACTORY_ABI from "static/abis/guildRewardNFTFactory.json"
import useSWRImmutable from "swr/immutable"

const useGuildFee = (
  chain: Chain
): { guildFee: BigNumber; isLoading: boolean; error: any } => {
  const guildRewardNftFactoryContract = useContract(
    GUILD_REWARD_NFT_FACTORY_ADDRESSES[chain],
    GUILD_REWARD_NFT_FACTORY_ABI
  )

  const {
    data: guildFee,
    isLoading,
    error,
  } = useSWRImmutable(
    guildRewardNftFactoryContract ? ["guildFee", chain] : null,
    () => guildRewardNftFactoryContract?.fee()
  )

  return {
    guildFee,
    isLoading,
    error,
  }
}

export default useGuildFee
