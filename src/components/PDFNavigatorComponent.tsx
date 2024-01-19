import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { useAtom, useAtomValue } from 'jotai';
import { FC, useEffect } from 'react';
import {
  pageAtom,
  scaleAtom,
  searchTextAtom,
  totalPagesAtom,
} from '../data/atoms';

import {
  Box,
  Divider,
  InputGroup,
  InputLeftElement,
  Select,
} from '@chakra-ui/react';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import MagnifyingGlassIcon from '../icons/MagnifyingGlassIcon';
import MinusIcon from '../icons/MinusIcon';
import PlusIcon from '../icons/PlusIcon';

type PDFNavigatorComponentProps = {
  windowRef?: any;
};

const PDFNavigatorComponent: FC<PDFNavigatorComponentProps> = ({
  windowRef,
}) => {
  const [page, setPage] = useAtom(pageAtom);
  const [, setScale] = useAtom(scaleAtom);
  const [text, setText] = useAtom(searchTextAtom);

  const totalPages = useAtomValue(totalPagesAtom);

  const scrollToItem = () => {
    windowRef.current && windowRef.current.scrollToItem(page - 1, 'start');
  };

  const nextPageDisabled = page >= totalPages;
  const prevPageDisabled = page <= 1;

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
        <Button
          onClick={() => setPage((p: number) => p - 1)}
          isDisabled={prevPageDisabled}
        >
          <ArrowUpIcon />
        </Button>
        <Divider orientation='vertical' mx='5px' />
        <Button
          onClick={() => setPage((p: number) => p + 1)}
          isDisabled={nextPageDisabled}
        >
          <ArrowDownIcon />
        </Button>
        <Input
          ml='5px'
          value={page}
          w={'80px'}
          mr='5px'
          onChange={(e) => {
            setPage(Number(e.target.value));
          }}
          type='text'
        />
        of {totalPages}
      </Box>

      <Box display='inherit'>
        <Button type='button' onClick={() => setScale((v: number) => v + 0.1)}>
          <PlusIcon />
        </Button>
        <Divider orientation='vertical' mx='5px' />
        <Button type='button' onClick={() => setScale((v: number) => v - 0.1)}>
          <MinusIcon />
        </Button>
        <Select
          ml='5px'
          minW='100px'
          onChange={(e) => {
            setScale(Number(e.target.value));
          }}
        >
          <option value={1}>100%</option>
          <option value={0.5}>50%</option>
          <option value={1.5}>150%</option>
          <option value={2}>200%</option>
        </Select>
      </Box>
    </Flex>
  );
};

export default PDFNavigatorComponent;
