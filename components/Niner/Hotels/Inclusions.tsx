import { Column, Row } from '@atom-web/micros';
import { format, isValid } from 'date-fns';
import { Session } from 'next-auth';
import React, { useCallback, useMemo } from 'react';

import { CostData, StayEntity } from '@apis/fetchCostDataByTrailId';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import StatusPill from '@components/Trail/StatusPill';
import useCities from '@hooks/useCities';
import withSession from '@utils/withSession';
import withTeam from '@utils/withTeam';

import InclusionDate from '../InclusionDate';

import RoomDetails from './RoomDetails';

const Inclusions = ({
  data,
  trail,
  expanded,
  isAllChecksMarked,
}: {
  data: StayEntity;
  index?: number;
  showSalesHod?: boolean;
  trail: CostData;
  session: Session;
  expanded?: boolean;
  isAllChecksMarked?: boolean;
}) => {
  const cities = useCities();

  const showCheckInTime = useCallback(() => {
    if (data && data.date && data.time1) {
      const dateTimeValue = data.date + ' ' + data.time1;
      const dateObject = new Date(dateTimeValue);
      if (isValid(dateObject)) {
        return format(dateObject, 'yyyy-MM-dd HH:mm a');
      }
    }
    return '--';
  }, [data]);

  const showCheckOutTime = useCallback(() => {
    if (data && data.to_date && data.time2) {
      const dateTimeValue = data.to_date + ' ' + data.time2;
      const dateObject = new Date(dateTimeValue);
      if (isValid(dateObject)) {
        return format(dateObject, 'yyyy-MM-dd HH:mm a');
      }
    }
    return '--';
  }, [data]);

  const cityName = useMemo(() => {
    if (!cities || !data || !data.from_to) return null;

    const filteredCities = cities.filter(
      city => city.id.toString() === data.from_to,
    );
    return filteredCities.length > 0 ? filteredCities[0].city : 'Stay city';
  }, [cities, data]);

  return (
    <Column css={{ gap: '$10i' }}>
      <Column
        css={{
          gap: '$8i',
          width: '100%',
        }}>
        <Row css={{ gap: '$6i' }}>
          <InclusionDate
            value={data.date}
            isAllChecksMarked={isAllChecksMarked}
          />
          <Column css={{ gap: '$2i' }}>
            <Text
              css={{
                color: '$grey700',
                fontSize: '$13',
                lineHeight: '$10i',
                fontWeight: 500,
              }}>
              {`${data?.duration}  nights at ${cityName} | ${data?.name}`}
            </Text>
            {!expanded ? (
              <Text
                css={{
                  color: '$grey600',
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 600,
                  cursor:'pointer',

                  textDecorationLine: 'underline',
                }}>
                View More
              </Text>
            ) : (
              <Text
                css={{
                  color: '$grey700',
                  fontSize: '$13',
                  lineHeight: '$10i',
                  fontWeight: 400,
                }}>
                {`${showCheckInTime()}->  ${showCheckOutTime()}`}
              </Text>
            )}
          </Column>
        </Row>
      </Column>
      {expanded && (
        <Column css={{ gap: '$8i' }}>
          <Row css={{ gap: '$4i', alignItems: 'center' }}>
            {data?.paid === 1 ? (
              <Column css={{ gap: '$6i' }}>
                <StatusPill varient="green" title="Booked" />
              </Column>
            ) : (
              <>
                {data?.status === 2 ? (
                  <StatusPill varient="yellow" title="Interim Confirm" />
                ) : null}
                {data?.status === 3 ? (
                  <StatusPill varient="red" title="Reject" />
                ) : null}
                {data?.status !== 2 && data?.status !== 3 ? (
                  <StatusPill varient="black" title="Yet to book" />
                ) : null}
              </>
            )}
            <StatusPill varient="blue" title={data?.trail_cost_id} />
          </Row>
          {data.room_details?.map((item, index) => {
            return (
              <Column
                key={index}
                css={{
                  borderBottom:
                    data?.room_details?.length === index + 1
                      ? 'none'
                      : '1px solid $grey400',
                  gap: '$4i',
                }}>
                <RoomDetails
                  room={item}
                  index={index}
                  prime={data?.prime}
                  trail={trail}
                />
              </Column>
            );
          })}
        </Column>
      )}
    </Column>
  );
};

export default withTeam(withSession(Inclusions, FullShimmer), FullShimmer);
