import React from 'react';

type PageProps = {
  children: string | JSX.Element | JSX.Element[] | React.ReactNode;
  style?: React.CSSProperties;
};

const Page = React.memo((props: PageProps) => {
  const { children, style } = props;
  const internalStyle = {
    ...style,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: '1px solid #ccc'
  };
  return <div style={internalStyle}>{children}</div>;
});

export default Page;
