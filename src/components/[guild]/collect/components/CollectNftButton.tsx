import { ButtonProps } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import useMemberships from "components/explorer/hooks/useMemberships"
import { Chains } from "connectors"
import useBalance from "hooks/useBalance"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"
import useCollectNft from "../hooks/useCollectNft"
import { useCollectNftContext } from "./CollectNftContext"

const join = (signedValidation: SignedValdation) =>
  fetcher(`/user/join`, signedValidation)

type Props = {
  label?: string
} & ButtonProps

const CollectNftButton = ({
  label = "Collect NFT",
  ...rest
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const showErrorToast = useShowErrorToast()

  const { roleId, chain, address, alreadyCollected } = useCollectNftContext()
  const { id, urlName } = useGuild()

  const {
    memberships,
    isLoading: isMembershipsLoading,
    mutate: mutateMemberships,
  } = useMemberships()
  const isMemberOfRole = !!memberships
    ?.find((membership) => membership.guildId === id)
    ?.roleIds.find((rId) => rId === roleId)

  const { chainId } = useWeb3React()
  const shouldSwitchNetwork = chainId !== Chains[chain]

  const {
    onSubmit: onMintSubmit,
    isLoading: isMinting,
    loadingText: mintLoadingText,
  } = useCollectNft()

  const { onSubmit: onJoinSubmit, isLoading: isJoinLoading } = useSubmitWithSign(
    join,
    {
      onSuccess: async () => {
        await mutateMemberships()
        onMintSubmit()
      },
      onError: () => showErrorToast("Couldn't check eligibility"),
    }
  )

  const { data: nftDetails, isValidating: isNftDetailsValidating } = useNftDetails(
    chain,
    address
  )
  const { isLoading: isNftBalanceLoading } = useBalance(address, Chains[chain])
  const { coinBalance, isLoading: isBalanceLoading } = useBalance(
    undefined,
    Chains[chain]
  )
  const isSufficientBalance =
    nftDetails?.fee && coinBalance ? coinBalance.gt(nftDetails.fee) : undefined

  const isLoading =
    isMembershipsLoading ||
    isJoinLoading ||
    isMinting ||
    isNftDetailsValidating ||
    isBalanceLoading
  const loadingText =
    isNftBalanceLoading || isJoinLoading || isMembershipsLoading
      ? "Checking eligibility"
      : isMinting
      ? mintLoadingText
      : "Checking your balance"

  const isDisabled =
    shouldSwitchNetwork || alreadyCollected || !isSufficientBalance || isLoading

  return (
    <Button
      size="lg"
      isDisabled={isDisabled}
      isLoading={isLoading}
      loadingText={loadingText}
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      onClick={() => {
        if (!isMemberOfRole) {
          onJoinSubmit({ guildId: id })
        } else {
          captureEvent("Click: CollectNftButton (GuildCheckout)", {
            guild: urlName,
          })
          onMintSubmit()
        }
      }}
      {...rest}
    >
      {alreadyCollected
        ? "Already collected"
        : typeof isSufficientBalance === "boolean" && !isSufficientBalance
        ? "Insufficient balance"
        : label}
    </Button>
  )
}

export default CollectNftButton
