import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { FC } from 'react';
import { ArrowDownIcon } from './ArroDownIcon';
import { ArrowUpIcon } from './ArrowUpIcon';
//TODO: total page count
type PDFNavigatorComponentProps = {
  scale?: number;
  setScale?: any;
  page: number;
  setPage?: any;
  windowRef?: any;
};

const PDFNavigatorComponent: FC<PDFNavigatorComponentProps> = ({
  page,
  setPage,
  windowRef,
  setScale,
}) => {
  const scrollToItem = () => {
    windowRef.current && windowRef.current.scrollToItem(page - 1, 'start');
  };
  return (
    <Flex>
      <ArrowDownIcon color='black' />
      <Button>
        <ArrowUpIcon />
      </Button>
      <Input value={page} onChange={(e) => setPage(e.target.value)} />
      <Button type='button' onClick={scrollToItem}>
        goto
      </Button>
      Zoom
      <Button type='button' onClick={() => setScale((v: number) => v + 0.1)}>
        +
      </Button>
      <Button type='button' onClick={() => setScale((v: number) => v - 0.1)}>
        -
      </Button>
    </Flex>
  );
};

export default PDFNavigatorComponent;
