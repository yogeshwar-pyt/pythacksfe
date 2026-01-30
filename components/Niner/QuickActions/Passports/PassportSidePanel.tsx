import { CSS } from '@atom-web/core';
import { Drawer } from '@atom-web/macros';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { CostData } from '@apis/fetchCostDataByTrailId';
import { Invoices } from '@apis/fetchUploadsByTrail';
import StyledButton from '@components/Button';

import PassportMain from './Main';

type PassportSidePanelProps = {
  onUpdate: () => void;
  css?: CSS;
};

export type PassportSidePanelUploadRefType = {
  open: (docs?: Invoices, trailData?: CostData) => void;
  close: () => void;
};
const PassportSidePanelUpload = forwardRef<
  PassportSidePanelUploadRefType,
  PassportSidePanelProps
>(({ css }, internalRef) => {
  const [docs, setDocs] = useState<Invoices>();

  const openButtonRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(internalRef, () => ({
    open: docs => {
      setDocs(docs);
      openButtonRef.current?.click();
    },
    close: () => {
      openButtonRef.current?.click();
    },
  }));

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <StyledButton ref={openButtonRef} />
      </Drawer.Trigger>
      <Drawer.Content
        overlayZindex={5}
        css={{
          zIndex: 6,
          width: '80%',
          height: '100%',
          overflow: 'auto',
          '> button': {
            top: '$sizes$8i',
            right: '$sizes$8i',
          },
          ...css,
        }}
        side="right">
        {' '}
        <PassportMain docs={docs?.passports} />
      </Drawer.Content>
    </Drawer.Root>
  );
});

PassportSidePanelUpload.displayName = 'PassportSidePanelUpload';

export default PassportSidePanelUpload;
