import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { pageAtom, scaleAtom, searchTextAtom } from './atoms';
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
    <Flex>
      <Button onClick={() => setPage((p: number) => p - 1)}>Prev page</Button>
      <Button onClick={() => setPage((p: number) => p + 1)}>Next page</Button>
      <Input
        value={page}
        onChange={(e) => {
          setPage(Number(e.target.value));
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
