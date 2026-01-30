import { Column } from '@atom-web/micros';
import { Session } from 'next-auth';
import React, { useRef } from 'react';

import { CostData } from '@apis/fetchCostDataByTrailId';
import { EmployeeWithRole } from '@apis/fetchUser';
import StyledButton from '@components/Button';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import PassengerDetailsSidePanel, {
  PassengerDetailsRefType,
} from '@components/Trail/Passenger/SidePanel';
import withSession from '@utils/withSession';

type ActionProps = {
  trailData: CostData;
  session: Session;
  loginUser: EmployeeWithRole;
  expanded?: boolean;
};

const Actions = ({}: ActionProps) => {
  const passengerDetailsRef = useRef<PassengerDetailsRefType>(null);
  return (
    <Column>
      <Column css={{ gap: '$6i' }}>
        <StyledButton
          css={{ padding: '$3i $6i', width: 'fit-content' }}
          onClick={() => passengerDetailsRef.current?.open('passenger')}
          secondary>
          <Text
            css={{
              fontSize: '$13',
              color: '$grey700',
              fontWeight: '500',
              lineHeight: '$10i',
            }}>
            Passport
          </Text>
        </StyledButton>
      </Column>

      <PassengerDetailsSidePanel
        ref={passengerDetailsRef}
        onUpdate={() => null}
      />
    </Column>
  );
};

export default withSession<ActionProps>(Actions, FullShimmer);
