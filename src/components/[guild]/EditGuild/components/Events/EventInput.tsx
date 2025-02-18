import {
  Circle,
  CloseButton,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { EventSourcesKey, GuildFormType } from "types"

type Props = {
  eventSource: EventSourcesKey
}

const placeholders: Record<EventSourcesKey, string> = {
  EVENTBRITE: "Eventbrite",
  LINK3: "Link3",
  LUMA: "lu.ma",
  DISCORD: "Diiscord",
}

const logos: Record<EventSourcesKey, string> = {
  EVENTBRITE: "/platforms/eventbrite.png",
  LINK3: "/platforms/link3.png",
  LUMA: "/platforms/luma.png",
  DISCORD: "/platforms/discord.png",
}

const EventInput = ({ eventSource }: Props) => {
  const { register, setValue } = useFormContext<GuildFormType>()

  return (
    <InputGroup size={"lg"}>
      <InputLeftElement>
        <Circle bgColor={"gray.900"} size={5}>
          <Img boxSize={5} src={logos[eventSource]} borderRadius={"full"} />
        </Circle>
      </InputLeftElement>
      <Input
        {...register(`eventSources.${eventSource}`)}
        size={"lg"}
        placeholder={placeholders[eventSource]}
      />
      <InputRightElement>
        <CloseButton
          aria-label="Remove link"
          size="sm"
          rounded="full"
          onClick={() => setValue(`eventSources.${eventSource}`, undefined)}
        />
      </InputRightElement>
    </InputGroup>
  )
}

export default EventInput
