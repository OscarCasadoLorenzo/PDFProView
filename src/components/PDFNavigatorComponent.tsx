import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { pageAtom, scaleAtom, searchTextAtom } from '../data/atoms';

import { Box, Divider, InputGroup, InputLeftElement } from '@chakra-ui/react';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import MagnifyingGlassIcon from '../icons/MagnifyingGlassIcon';
import MinusIcon from '../icons/MinusIcon';
import PlusIcon from '../icons/PlusIcon';

//TODO: total page count
type PDFNavigatorComponentProps = {
  windowRef?: any;
};

const PDFNavigatorComponent: FC<PDFNavigatorComponentProps> = ({
  windowRef,
}) => {
  const [page, setPage] = useAtom(pageAtom);
  const [, setScale] = useAtom(scaleAtom);
  const [text, setText] = useAtom(searchTextAtom);

  const scrollToItem = () => {
    windowRef.current && windowRef.current.scrollToItem(page - 1, 'start');
  };

  useEffect(() => {
    scrollToItem();
  }, [page]);

  return (
    <Flex justifyContent='space-between'>
      <InputGroup maxW={'500px'}>
        <InputLeftElement>
          <MagnifyingGlassIcon />
        </InputLeftElement>
        <Input
          value={text}
          placeholder='Search text'
          onChange={(e) => setText(e.target.value)}
        />
      </InputGroup>

      <Box display='inherit' alignItems='center'>
        <Button onClick={() => setPage((p: number) => p - 1)}>
          <ArrowDownIcon />
        </Button>
        <Divider orientation='vertical' />
        <Button onClick={() => setPage((p: number) => p + 1)}>
          <ArrowUpIcon />
        </Button>
        <Input
          value={page}
          maxW={'100px'}
          onChange={(e) => {
            setPage(Number(e.target.value));
          }}
          type='text'
        />
        de 14
      </Box>

      <Box display='inherit'>
        <Button type='button' onClick={() => setScale((v: number) => v + 0.1)}>
          <PlusIcon />
        </Button>
        <Button type='button' onClick={() => setScale((v: number) => v - 0.1)}>
          <MinusIcon />
        </Button>
      </Box>
    </Flex>
  );
};

export default PDFNavigatorComponent;
