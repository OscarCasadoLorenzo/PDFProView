import { fileAtom } from '@/features/pdfViewer/data/atoms';
import { Button, Center, Text, chakra } from '@chakra-ui/react';
import { useSetAtom } from 'jotai';
import { FC, useRef, useState } from 'react';
import UploadIcon from '../../../icons/UploadIcon';
import {
  extractBinaryWithDrop,
  extractBinaryWithInput,
} from '../helpers/extract-binary-from-event';

type DroppableProps = {
  id: string;
};

const Droppable: FC<DroppableProps> = (props: DroppableProps) => {
  const setFileAtom = useSetAtom(fileAtom);

  const [itemOver, setItemOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const changeImageDropped = (blob: any) => {
    const url = URL.createObjectURL(blob);

    setFileAtom({ name: blob.name, url: url });
  };
  function dropHandler(e: any) {
    const blob = extractBinaryWithDrop(e);
    changeImageDropped(blob);
  }

  function dragOverHandler(e: any) {
    setItemOver(true);
    e.preventDefault();
  }

  return (
    <>
      <Center
        border='3px dashed gray'
        borderRadius='20px'
        p='15px 20px'
        flexDirection='column'
        id='dropZone'
        bg={itemOver ? 'gray.100' : 'white'}
        onDrop={(e) => dropHandler(e)}
        onDragOver={(e) => dragOverHandler(e)}
        onDragLeave={() => setItemOver(false)}
      >
        <UploadIcon boxSize='36' />
        <Text fontWeight='bold' fontSize='20px'>
          Drag & drop
        </Text>
        OR
        <Button colorScheme='blue' onClick={() => inputRef.current?.click()}>
          Browse file
        </Button>
        <chakra.input
          ref={inputRef}
          type='file'
          display='none'
          onChange={(e) => {
            const blob = extractBinaryWithInput(e);
            changeImageDropped(blob);
          }}
        />
      </Center>
      <Text>Accepted File Types: .pdf</Text>
    </>
  );
};
export default Droppable;
