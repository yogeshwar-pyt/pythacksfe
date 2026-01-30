import { Column, Row } from '@atom-web/micros';
import React from 'react';

import { CostData } from '@apis/fetchCostDataByTrailId';
import NinerAllCheckMarked from '@components/Icons/NinerAllCheckMarked';
import NinerCheck from '@components/Icons/NinerCheck';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import withSession from '@utils/withSession';
import withTeam from '@utils/withTeam';

const Inclusions = ({
  isAllChecksMarked,
  trailData,
}: {
  isAllChecksMarked?: boolean;
  trailData: CostData;
}) => {
  return (
    <Column
      css={{
        width: '100%',
      }}>
      <Row css={{ gap: '$6i' }}>
        <Column
          css={{
            width: 40,
            height: 46,
            background: isAllChecksMarked ? '$green300' : '$grey200',
            border: isAllChecksMarked ? 'none' : '1px dashed $grey450',
            borderRadius: '$3',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {isAllChecksMarked ? (
            <NinerAllCheckMarked />
          ) : (
            <NinerCheck width={24} height={24} fill="$grey600" />
          )}
        </Column>
        <Column css={{ gap: '$3i', alignItems: 'flex-start' }}>
          <Text
            css={{
              color: '$grey700',
              fontSize: '$13',
              lineHeight: '$10i',
              fontWeight: 500,
            }}>
            Check Passports, Custom Cards etc
          </Text>
          <Text
            css={{
              color: '$grey700',
              fontSize: '$13',
              lineHeight: '$10i',
              fontWeight: 400,
            }}>
            {`${trailData?.adult ?? 0} adults ${trailData?.child ?? 0} child ${
              trailData?.infant ?? 0
            } Infant`}
          </Text>
        </Column>
      </Row>
    </Column>
  );
};

export default withTeam(withSession(Inclusions, FullShimmer), FullShimmer);
