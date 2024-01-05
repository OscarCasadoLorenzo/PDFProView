import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { FC, useEffect } from 'react';
//TODO: total page count
type PDFNavigatorComponentProps = {
  scale?: number;
  setScale?: any;
  page: number;
  setPage?: any;
  windowRef?: any;
  text?: string;
  setText?: any;
};

const PDFNavigatorComponent: FC<PDFNavigatorComponentProps> = ({
  page,
  setPage,
  windowRef,
  setScale,
  text,
  setText,
}) => {
  const scrollToItem = () => {
    windowRef.current && windowRef.current.scrollToItem(page - 1, 'start');
  };

  useEffect(() => {
    scrollToItem();
  }, [page]);

  return (
    <Flex>
      <Button onClick={() => setPage((p: number) => p - 1)}>Prev page</Button>
      <Button onClick={() => setPage((p: number) => p + 1)}>Next page</Button>
      <Input
        value={page}
        onChange={(e) => {
          setPage(e.target.value);
        }}
        type='text'
      />
      <Input value={text} onChange={(e) => setText(e.target.value)} />
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
