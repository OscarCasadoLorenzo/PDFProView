import { FC } from 'react';
import Droppable from '../components/Droppable';

type UploadFileComponentProps = {};

const UploadFileComponent: FC<
  UploadFileComponentProps
> = ({}: UploadFileComponentProps) => {
  return <Droppable id='droppable' />;
};

export default UploadFileComponent;
