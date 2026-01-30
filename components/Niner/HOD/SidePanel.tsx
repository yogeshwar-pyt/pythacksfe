import { CSS } from '@atom-web/core';
import { Drawer } from '@atom-web/macros';
import { Column, Row } from '@atom-web/micros';
import { forwardRef, useImperativeHandle, useRef } from 'react';

import StyledButton from '@components/Button';
import Text from '@components/Text';

import CxHod from './CxHod';
import SalesHod from './SalesHod';

type HodProps = {
  onUpdate: () => void;
  css?: CSS;
  from: string;
  trailCostId: number;
  costingId?: string;
};

export type HodRefType = {
  open: () => void;
  close: () => void;
};
const HodSidePanel = forwardRef<HodRefType, HodProps>(
  ({ css, from, trailCostId, costingId }, internalRef) => {
    const openButtonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(internalRef, () => ({
      open: () => {
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
            width: '1000px',
            height: '100%',
            overflow: 'auto',
            '> button': {
              top: '$sizes$8i',
              right: '$sizes$8i',
            },
            ...css,
          }}
          side="right">
          <Column
            css={{
              height: '100%',
              overflow: 'hidden',
              width: '100%',
            }}>
            <Column
              css={{
                padding: '$10i $12i',
                borderBottom: '1px solid $colors$grey400',
              }}>
              <Text
                md
                css={{ fontWeight: '$semibold', textTransform: 'capitalize' }}>
                Handover Document
              </Text>
            </Column>

            <Column
              css={{
                flex: 1,
                width: '100%',
                maxWidth: '100%',
                overflow: 'scroll',
                gap: '$10i',
                padding: '$10i $12i',
              }}>
              <SalesHod from={from} trailCostId={costingId} />
              <CxHod from={from} trailCostId={trailCostId} />
            </Column>
            <Row
              css={{
                margin: '$10i $12i',
                padding: '$10i $12i',
                justifyContent: 'flex-end',
                alignItems: 'center',
                background: '$grey100',
                borderRadius: '$3',
                border: '1px solid $grey400',
              }}>
              <StyledButton
                onClick={() => openButtonRef.current?.click()}
                type="submit"
                primary
                css={{
                  $$paddingX: '$sizes$16i',
                  $$paddingY: '$sizes$6i',
                  borderRadius: '$sizes$3i',
                  height: 36,
                }}>
                Ok, Got it
              </StyledButton>
            </Row>
          </Column>
        </Drawer.Content>
      </Drawer.Root>
    );
  },
);

HodSidePanel.displayName = 'Hod';

export default HodSidePanel;
