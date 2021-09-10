import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Select,
  Switch,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { nfts } from "temporaryData/nfts"
import { RequirementTypeColors } from "temporaryData/types"
import useNftCustomAttributeNames from "./hooks/useNftCustomAttributeNames"
import useNftCustomAttributeValues from "./hooks/useNftCustomAttributeValues"

type Props = {
  index: number
  clickHandler?: () => void
}

const NftFormCard = ({ index, clickHandler }: Props): JSX.Element => {
  const {
    setValue,
    register,
    getValues,
    formState: { errors },
  } = useFormContext()
  const type = getValues(`requirements.${index}.type`)

  const { colorMode } = useColorMode()

  const [canAddAttributes, setCanAddAttributes] = useState(false)

  const handleAttributesChange = (e) => {
    setCanAddAttributes(e.target.checked)
    setValue(`requirements.${index}.customAttributeName`, "")
    setValue(`requirements.${index}.customAttributeValue`, "")
  }

  const pickedNftAddress = useWatch({ name: `requirements.${index}.address` })
  const nftCustomAttributeNames = useNftCustomAttributeNames(pickedNftAddress)
  const pickedAttribute = useWatch({
    name: `requirements.${index}.customAttributeName`,
  })
  const nftCustomAttributeValues = useNftCustomAttributeValues(
    pickedNftAddress,
    pickedAttribute
  )

  return (
    <Card
      role="group"
      position="relative"
      px={{ base: 5, sm: 7 }}
      pt={10}
      pb={7}
      w="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      borderWidth={2}
      borderColor={RequirementTypeColors[type]}
      overflow="visible"
      _before={{
        content: `""`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: "primary.300",
        opacity: 0,
        transition: "opacity 0.2s",
      }}
    >
      {typeof clickHandler === "function" && (
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          width={8}
          height={8}
          rounded="full"
          zIndex="docked"
          aria-label="Remove level"
          onClick={clickHandler}
        />
      )}
      <VStack spacing={4} alignItems="start">
        <FormControl
          isRequired
          isInvalid={
            type &&
            errors.requirements &&
            errors.requirements[index] &&
            errors.requirements[index].address
          }
        >
          <FormLabel>Pick an NFT:</FormLabel>

          <Select
            {...register(`requirements.${index}.address`, {
              required: "This field is required.",
            })}
          >
            <option value="" defaultChecked>
              Select one
            </option>
            {nfts.map((nft) => (
              <option key={nft.address} value={nft.address}>
                {nft.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.requirements && errors.requirements[index]?.address?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
          <HStack>
            <Switch
              id="attributes"
              colorScheme="green"
              checked={canAddAttributes}
              onChange={handleAttributesChange}
            />
            <FormLabel htmlFor="attributes">Attributes</FormLabel>
          </HStack>
        </FormControl>

        <FormControl
          isRequired={canAddAttributes}
          isInvalid={
            canAddAttributes &&
            errors.requirements &&
            errors.requirements[index]?.customAttributeName
          }
          isDisabled={!canAddAttributes || !nftCustomAttributeNames?.length}
        >
          <FormLabel>Custom attribute:</FormLabel>

          <Select
            {...register(`requirements.${index}.customAttributeName`, {
              required: {
                value: canAddAttributes,
                message: "This field is required.",
              },
            })}
          >
            <option value="" defaultChecked>
              Select one
            </option>
            {nftCustomAttributeNames?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.requirements &&
              errors.requirements[index]?.customAttributeName?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isRequired={canAddAttributes}
          isInvalid={
            canAddAttributes &&
            errors.requirements &&
            errors.requirements[index]?.customAttributeValue
          }
          isDisabled={!canAddAttributes || !nftCustomAttributeValues?.length}
        >
          <FormLabel>Custom attribute value:</FormLabel>

          <Select
            {...register(`requirements.${index}.customAttributeValue`, {
              required: {
                value: canAddAttributes,
                message: "This field is required.",
              },
            })}
            isDisabled={!nftCustomAttributeValues?.length}
          >
            <option value="" defaultChecked>
              Select one
            </option>
            {nftCustomAttributeValues?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </Select>

          <FormErrorMessage>
            {errors.requirements &&
              errors.requirements[index]?.customAttributeValue?.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </Card>
  )
}

export default NftFormCard
