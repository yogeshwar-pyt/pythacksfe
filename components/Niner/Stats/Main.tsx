import { Column, Row } from '@atom-web/micros';
import React, { useCallback } from 'react';

import Text from '@components/Text';

import CircleProgress from '../utils/ProgressBar';

const content = [{ title: 'Niner Completion', label: 'niner_completion' }];

const NinerStats = ({
  ninerCheckPercentage,
}: {
  ninerCheckPercentage: number;
}) => {
  const showStats = useCallback(
    (from: string) => {
      switch (from) {
        case 'niner_completion':
          return `${ninerCheckPercentage}%`;
          break;

        default:
          return;
      }
    },
    [ninerCheckPercentage],
  );

  return (
    <Row
      css={{
        gap: '$6i',
      }}>
      {content.map((type, index) => {
        return (
          <Row
            key={index}
            css={{
              border: '1px solid $grey400',
              borderRadius: '$3',
              padding: '$6i $12i',
              gap: '$6i',
              background: '$grey100',
              justifyContent: 'center',
              alignItems: 'center',
              width: 'fit-content',
              height: 'fit-content',
              minWidth: '200px',
            }}>
            {type.label === 'niner_completion' && (
              <CircleProgress
                percentage={ninerCheckPercentage}
                mode="percentage"
              />
            )}
            <Column
              css={{
                gap: '$2i',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text
                css={{
                  fontSize: '$13',
                  lineHeight: '$10i',
                  color: '$grey700',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                }}>
                {type.title}
              </Text>
              <Text
                css={{
                  fontSize: '$9i',
                  lineHeight: '$12i',
                  color: '$grey700',
                  fontWeight: 600,
                  letterSpacing: '-0.1px',
                  textTransform: 'capitalize',
                }}>
                {showStats(type.label)}
              </Text>
            </Column>
          </Row>
        );
      })}
    </Row>
  );
};

export default NinerStats;
