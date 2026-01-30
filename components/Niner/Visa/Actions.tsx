import { Column, IconButton, Row } from '@atom-web/micros';
import isEmpty from 'lodash.isempty';
import { Session } from 'next-auth';
import React, { Suspense, useRef } from 'react';

import { VisaEntity, CostData } from '@apis/fetchCostDataByTrailId';
import { EmployeeWithRole } from '@apis/fetchUser';
import StyledButton from '@components/Button';
import Expand from '@components/Icons/Expand';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import SidePanelUpload, {
  SidePanelUploadRefType,
} from '@components/Trail/CostSheet/LineitemUploads/SidePanelUpload';
import withSession from '@utils/withSession';

import HodSidePanel, { HodRefType } from '../HOD/SidePanel';

type ActionProps = {
  visaItem: VisaEntity;
  trailData: CostData;
  session: Session;
  loginUser: EmployeeWithRole;
  expanded?: boolean;
};

const Actions = ({ trailData, expanded, visaItem }: ActionProps) => {
  const uploadPanelButtonRef = useRef<SidePanelUploadRefType>(null);
  const HodButtonRef = useRef<HodRefType>(null);
  return (
    <Column>
      {expanded ? (
        <Column css={{ gap: '$6i' }}>
          <StyledButton
            css={{ padding: '$3i $6i', width: 'fit-content' }}
            disabled={!visaItem?.voucher_link}
            onClick={() => {
              if (!isEmpty(visaItem?.voucher_link)) {
                uploadPanelButtonRef.current?.open(
                  visaItem,
                  trailData,
                  'voucher',
                );
              }
            }}
            secondary>
            <Text
              css={{
                fontSize: '$13',
                color: '$grey700',
                fontWeight: '500',
                lineHeight: '$10i',
              }}>
              Voucher
            </Text>
          </StyledButton>

          <StyledButton
            css={{ padding: '$3i $6i', width: 'fit-content' }}
            secondary
            onClick={() => HodButtonRef.current?.open()}>
            <Text
              css={{
                fontSize: '$13',
                color: '$grey700',
                fontWeight: '500',
                lineHeight: '$10i',
              }}>
              View HoD
            </Text>
          </StyledButton>
        </Column>
      ) : (
        <Row css={{ gap: '$6i' }}>
          <StyledButton
            css={{ padding: '$3i $6i', width: 'fit-content' }}
            disabled={!visaItem?.voucher_link}
            onClick={() => {
              if (!isEmpty(visaItem?.voucher_link)) {
                uploadPanelButtonRef.current?.open(
                  visaItem,
                  trailData,
                  'voucher',
                );
              }
            }}
            secondary>
            <Text
              css={{
                fontSize: '$13',
                color: '$grey700',
                fontWeight: '500',
                lineHeight: '$10i',
              }}>
              Voucher
            </Text>
          </StyledButton>

          <IconButton
            css={{ cursor: 'pointer', border: '1px solid $grey400' }}
            size={2}>
            <Expand width={24} height={24} />
          </IconButton>
        </Row>
      )}

      <SidePanelUpload
        ref={uploadPanelButtonRef}
        onUpdate={() => {
          // refetch();
        }}
      />
      <Suspense fallback={<FullShimmer />}>
        <HodSidePanel
          ref={HodButtonRef}
          onUpdate={() => {
            // refetch();
          }}
          from={'visa'}
          trailCostId={visaItem?.trail_cost_id}
          costingId={visaItem?.costing_id}
        />
      </Suspense>
    </Column>
  );
};

export default withSession<ActionProps>(Actions, FullShimmer);
