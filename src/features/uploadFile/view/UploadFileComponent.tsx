import { FC, useState } from 'react';
import Droppable from '../components/Droppable';

type UploadFileComponentProps = {};

const UploadFileComponent: FC<
  UploadFileComponentProps
> = ({}: UploadFileComponentProps) => {
  const [parent, setParent] = useState(null);

  return <Droppable id='droppable' />;
};

export default UploadFileComponent;
