import {
  Box,
  Center,
  Divider,
  HStack,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import { Modal } from "components/common/Modal"
import {
  ArrowSquareOut,
  CaretDown,
  Check,
  Shield,
  ShieldCheck,
} from "phosphor-react"
import { useEffect, useRef } from "react"
import pluralize from "utils/pluralize"
import useEditSharedSocials from "../hooks/useEditSharedSocials"

const SharedConnections = () => {
  const { id } = useGuild()
  const { sharedSocials } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const guildSharedSocial =
    id && sharedSocials?.find((sharedSocial) => sharedSocial.guildId === id)

  const buttonProps = {
    size: "sm",
    variant: "ghost",
    ml: "auto",
    my: "-1 !important",
    onClick: onOpen,
    // so we can focus it from useNewSharedConnectionsToast
    id: "sharedConnectionsButton",
    _focus: {
      boxShadow: "var(--chakra-shadows-outline)",
    },
  }

  // so the button doesn't get the focus ring on close
  const dummyRef = useRef(null)

  return (
    <>
      <span ref={dummyRef} />
      {!guildSharedSocial ? (
        <Button {...buttonProps} leftIcon={<Shield />}>
          {`Shared with ${pluralize(
            sharedSocials?.filter((sharedSocial) => sharedSocial.isShared !== false)
              ?.length,
            "guild"
          )}`}
        </Button>
      ) : guildSharedSocial.isShared !== false ? (
        <Button {...buttonProps} leftIcon={<ShieldCheck />} color={"green.500"}>
          Shared with guild
        </Button>
      ) : (
        <Button {...buttonProps} leftIcon={<Shield />}>
          Hidden to guild
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        colorScheme="duotone"
        scrollBehavior="inside"
        finalFocusRef={dummyRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb="6" display={"flex"}>
            <Text>Shared account connections</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="8">
              Choose which CRM enabled guilds you share your connections with.{" "}
              <Link colorScheme="gray" fontWeight={"semibold"}>
                Learn more <Icon as={ArrowSquareOut} ml="1" />
              </Link>
            </Text>
            <Stack>
              {sharedSocials?.map((sharedSocial) => (
                <ShareConnectionsWithGuildSelect
                  key={sharedSocial.guildId}
                  guildId={sharedSocial.guildId}
                  sharedSocials={sharedSocials}
                />
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const ShareConnectionsWithGuildSelect = ({ guildId, sharedSocials }) => {
  const { imageUrl, name } = useGuild(guildId)
  const { onSubmit, isLoading, submit } = useEditSharedSocials(guildId)

  const isShared = sharedSocials?.find(
    (sharedSocial) => sharedSocial.guildId === guildId
  ).isShared

  /**
   * Change null to true on mount (without toast), indicating that the user has seen
   * the notification, and the useNewSharedConnectionsToast won't fire again
   */
  useEffect(() => {
    if (isShared === null) submit(true)
  }, [])

  const isSharedBoolean = isShared !== false

  return (
    <HStack gap={4}>
      <GuildLogo imageUrl={imageUrl} size="36px" />
      <Skeleton w="full" isLoaded={!!name?.length}>
        <Text as="span" fontSize="lg" fontWeight="bold" noOfLines={1}>
          {name}
        </Text>
      </Skeleton>
      <Menu placement="bottom-end" size={"sm"} strategy="fixed" autoSelect={false}>
        <MenuButton
          as={Button}
          leftIcon={isSharedBoolean ? <ShieldCheck /> : <Shield />}
          color={isSharedBoolean ? "green.500" : "initial"}
          variant="ghost"
          size="sm"
          rightIcon={<CaretDown />}
          isLoading={isLoading}
          flexShrink="0"
        >
          {isSharedBoolean ? "Shared" : "Hidden"}
        </MenuButton>
        <MenuList py="0" overflow={"hidden"} borderRadius={"lg"}>
          <MenuItemOption
            title="Shared"
            description="The guild owner can see your account connections"
            icon={ShieldCheck}
            onClick={() => onSubmit(true)}
            selected={isSharedBoolean}
          />
          <Divider />
          <MenuItemOption
            title="Hidden"
            description="Your connections are kept private"
            icon={Shield}
            onClick={() => onSubmit(false)}
            selected={!isSharedBoolean}
          />
        </MenuList>
      </Menu>
    </HStack>
  )
}

const MenuItemOption = ({ title, description, icon, onClick, selected }) => (
  <MenuItem onClick={!selected ? onClick : null} py="4">
    <HStack spacing={4} w="full">
      <Center boxSize="3">{selected && <Icon as={Check} />}</Center>
      <Box w="290px">
        <Text fontWeight={"bold"}>{title}</Text>
        <Text colorScheme="gray">{description}</Text>
      </Box>
      <Icon as={icon} />
    </HStack>
  </MenuItem>
)

export default SharedConnections
