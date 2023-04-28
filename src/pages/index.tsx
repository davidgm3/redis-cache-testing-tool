import Head from 'next/head';
import {
  Box,
  Button,
  Circle,
  Container,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { IconButtonProps, forwardRef } from '@chakra-ui/react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const QuestionButton = forwardRef<IconButtonProps, 'button'>((props, ref) => {
  return (
    <IconButton
      {...props}
      ref={ref}
      icon={<QuestionOutlineIcon />}
      aria-label={'question'}
    />
  );
});

export default function Home() {
  const [urlValue, setUrlValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    cached: number[];
    uncached: number[];
  } | null>(null);

  const toast = useToast();

  const submitForm = async () => {
    setLoading(true);
    setData(null);
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        body: JSON.stringify({ url: urlValue }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setData(data);
    } catch (err: any) {
      toast({
        title: 'An error occurred.',
        description: err?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
    setLoading(false);
  };

  // Assume that cached and uncached are the same length
  const formattedData =
    data &&
    data.cached.map((item, index) => {
      return {
        cached: item,
        uncached: data.uncached[index],
      };
    });

  return (
    <>
      <Head>
        <title>Redis Caching Testing Tool</title>
      </Head>
      <Box h={'100%'} bgGradient={'linear(to-r, blue.50,pink.50)'}>
        <Container px={[3, 8]} py={6} rounded={8} maxW={'container.md'}>
          <Flex mb={6} align='center' gap={8} justify={'space-between'}>
            <Text fontSize={['2xl', '4xl']} fontWeight={600}>
              Redis Caching Testing Tool
            </Text>
            <Menu>
              <MenuButton as={QuestionButton} aria-label={''} />
              <MenuList p={4}>
                <Box mb={2} w={[300, 400]}>
                  <Text>
                    This is a simple tool that will test and compare the
                    response time of a request to a URL with and without Redis
                    caching. First, type in a URL and click send. The app will
                    then make different requests to the URL and compare the
                    response times. The results will be displayed in a graph
                    below.
                  </Text>
                </Box>
              </MenuList>
            </Menu>
          </Flex>
          <Flex mb={2} align='end' gap={8}>
            <Box w={'100%'}>
              <Text fontSize='xl' fontWeight={600} mb={1}>
                URL
              </Text>
              <Input
                bgColor={'white'}
                placeholder='Basic usage'
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
              />
            </Box>
            <Button
              colorScheme='teal'
              isLoading={loading}
              onClick={() => submitForm()}
            >
              Send
            </Button>
          </Flex>
          {data && formattedData && (
            <Box mt={2}>
              <Text fontSize='xl' fontWeight={600} mb={1}>
                Results
              </Text>

              <Flex align='center' gap={2} mb={1}>
                <Circle size={2} bg={'#810fdf'} />
                <Text>
                  <Text as='span' fontWeight={600}>
                    Cached:{' '}
                  </Text>
                  {data?.cached.map(
                    (item, index) =>
                      item + (index === data.cached.length - 1 ? 'ms' : ', ')
                  )}
                </Text>
              </Flex>

              <Flex align='center' gap={2} mb={4}>
                <Circle size={2} bg={'#1f14e0'} />
                <Text>
                  <Text as='span' fontWeight={600}>
                    Uncached:{' '}
                  </Text>
                  {data.uncached.map(
                    (item, index) =>
                      item + (index === data.uncached.length - 1 ? 'ms' : ', ')
                  )}
                </Text>
              </Flex>

              <ResponsiveContainer width='100%' height={400}>
                <LineChart data={formattedData}>
                  <XAxis dataKey='name' />
                  <YAxis width={20} />
                  <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
                  <Line
                    type='monotone'
                    dataKey='uncached'
                    label='Uncached'
                    stroke='#1f14e0'
                  />
                  <Line
                    type='monotone'
                    dataKey='cached'
                    label='Cached'
                    stroke='#810fdf'
                  />
                  <Tooltip formatter={(value) => `${value} ms`} label={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
