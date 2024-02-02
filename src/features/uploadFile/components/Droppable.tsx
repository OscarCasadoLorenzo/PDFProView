import { fileAtom } from '@/features/pdfViewer/data/atoms';
import { Button, Center, Text, chakra } from '@chakra-ui/react';
import { useSetAtom } from 'jotai';
import { FC, useEffect, useRef, useState } from 'react';
import UploadIcon from '../../../icons/UploadIcon';

type DroppableProps = {
  id: string;
};

const Droppable: FC<DroppableProps> = (props: DroppableProps) => {
  const [imageDropped, setImageDropped] = useState<string | ArrayBuffer | null>(
    null
  );

  const setFileAtom = useSetAtom(fileAtom);

  useEffect(() => {
    console.log({ imageDropped });
  }, [imageDropped]);
  const [itemOver, setItemOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const changeImageDropped = (blob: any) => {
    console.log({ blob });
    const url = URL.createObjectURL(blob);

    setFileAtom({ name: blob.name, url: url });
    console.log({ url });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = (e) => {
      e.preventDefault();
      e.target?.result && setImageDropped(e.target?.result);
    };

    //You are not able to access/use the user's local file-system path. This means that you can't use the real path to the file on their machine to preview.
  };
  function dropHandler(e: any) {
    e.preventDefault();
    changeImageDropped(e);
    console.log(e.dataTransfer.files);
  }

  function dragOverHandler(e: any) {
    setItemOver(true);

    const blob = e.dataTransfer.files[0];
    console.log('File(s) in drop zone');
    changeImageDropped(blob);
    // Prevent default behavior (Prevent file from being opened)
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
            console.log(e.target.files);
            const blob = e.target.files?.[0];
            changeImageDropped(blob);
            e.preventDefault();
          }}
        />
      </Center>
      <Text>Accepted File Types: .pdf</Text>
    </>
  );
};
export default Droppable;
