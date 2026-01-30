import { Column } from '@atom-web/micros';
import { getDate, getMonth } from 'date-fns';
import React from 'react';

import Text from '@components/Text';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const InclusionDate = ({
  value,
  isAllChecksMarked,
}: {
  value: string | number;
  isAllChecksMarked?: boolean;
}) => {
  const month = getMonth(new Date(value));
  const date = getDate(new Date(value));
  return (
    <Column
      css={{
        width: 'fit-content',
        minWidth: '40px',
        height: 'fit-content',
        padding: '$3i $4i $2i $4i',
        gap: '$1i',
        background: isAllChecksMarked ? '$green300' : '$grey200',
        border: isAllChecksMarked ? 'none' : '1px dashed $grey450',
        borderRadius: '$3',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        css={{
          fontSize: '$5i',
          color: isAllChecksMarked ? '$white' : '$grey600',
          fontWeight: 600,
          lineHeight: '$6i',
          textTransform: 'uppercase',
        }}>
        {months[month]}
      </Text>
      <Text
        css={{
          fontSize: '$8i',
          color: isAllChecksMarked ? '$white' : '$grey600',
          fontWeight: 600,
          lineHeight: '$12i',
        }}>
        {date}
      </Text>
    </Column>
  );
};

export default InclusionDate;
