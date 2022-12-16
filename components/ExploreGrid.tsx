import {Box, Flex, Heading, HStack, Image, Link, SimpleGrid, Tag} from "@chakra-ui/react";

export default function ExploreGrid(props: { data: any }) {
  const {data} = props;

  // <Link href="/stability-ai/stable-diffusion" className="no-default no-focus">
  //   <Box h="80" mb="2">
  //   <Flex h="full" w="full" overflow="hidden">
  //     <Image src="https://bucketeer-be99e627-94e7-4e5b-a292-54eeb40ac303.s3.amazonaws.com/public/models_models_featured_image/e96fbb21-ac3c-4ecb-a844-3239e49ee55a/out-0-15.png" alt="" objectFit="cover" objectPosition="center" h="full" w="full" />
  //   </Flex>
  // </Box>
  // <Box>
  //   <Flex>
  //     <Heading size="md" className="flex-shrink whitespace-nowrap overflow-hidden overflow-ellipsis">
  //       <Text className="text-shade">stability-ai</Text>
  //       <Text className="text-shade px-1"> stable</Text>
  //     </Heading>
  //   </Flex>
  //   <Text>
  //     A latent text-to-image diffusion model capable of generating photo-realistic images given any text input
  //   </Text>
  //   <Text className="text-shade text-sm float-right">
  //     test
  //   </Text>
  // </Box>
  // </Link>

  // @ts-ignore
  return (
      <SimpleGrid columns={{sm: 1, md: 2, xl: 3}} gap={{sm: 1, md: 2, xl: 4}} autoRows={'max'}>
        {data.map((item: any) => (
            <Link key={item.name}>
              <Box h="80" mb="2">
                <Flex h="full" w="full" overflow="hidden">
                  <Image src={item.image} alt="" objectFit="cover" objectPosition="center" h="full" w="full"/>
                </Flex>
              </Box>
              <Box>
                <Flex>
                  <Heading size="md">
                    {item.name}
                  </Heading>
                </Flex>
                <HStack>
                  {item.tags.map(
                      (tag: any) => (
                          <Tag key={tag}>{tag}</Tag>
                      )
                  )}
                </HStack>
              </Box>
            </Link>
        ))}
      </SimpleGrid>
  )
}
