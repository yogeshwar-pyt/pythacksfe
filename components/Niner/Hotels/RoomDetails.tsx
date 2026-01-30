import Breakfast from '@atom-web/icons-16/Breakfast';
import NonRefundable from '@atom-web/icons-16/NonRefundable';
import Refundable from '@atom-web/icons-16/Refundable';
import Wifi from '@atom-web/icons-16/Wifi';
import { Column, Row } from '@atom-web/micros';
import React from 'react';

import {
  CostData,
  RoomDetails as RoomDetailsType,
  StayPrime,
} from '@apis/fetchCostDataByTrailId';
import Lift from '@components/Icons/Lift';
import Text from '@components/Text';

const RoomDetails = ({
  index,
  room,
  prime,
  trail,
}: {
  room: RoomDetailsType;
  index: number;
  prime?: StayPrime;
  trail: CostData;
}) => {
  return (
    <Column
      css={{
        gap: '$6i',
        width: '100%',
        paddingBottom: '$10i',
      }}>
      <Text
        css={{
          fontSize: '$11',
          lineHeight: '$6ii',
          fontWeight: 600,
          color: '$grey600',
          textTransform: 'uppercase',
        }}>
        {`Room #${index + 1} - ${trail?.adult} ${
          trail?.adult > 1 ? 'adults' : 'adult'
        }`}
      </Text>
      <Column css={{ gap: '$4i' }}>
        <Text
          css={{
            color: '$grey700',
            fontWeight: 500,
            fontSize: '$13',
            lineHeight: '$10i',
          }}>
          {room.room_type} {room.bed_type}
        </Text>
        {prime?.breakfast ? (
          <Row css={{ alignItems: 'center', gap: '$4i' }}>
            <Breakfast css={{ width: 20, height: 20, fill: '$green300' }} />
            <Text
              css={{
                fontSize: '$13',
                lineHeight: '$10i',
                fontWeight: 400,
                color: '$green300',
              }}>
              Free Breakfast
            </Text>
          </Row>
        ) : null}
        {prime?.wifi ? (
          <Row css={{ alignItems: 'center', gap: '$4i' }}>
            <Wifi css={{ width: 20, height: 20, fill: '$grey500' }} />
            <Text
              css={{
                fontSize: '$13',
                lineHeight: '$10i',
                fontWeight: 400,
                color: '$grey600',
              }}>
              Free wifi
            </Text>
          </Row>
        ) : null}
        {prime?.lift ? (
          <Row css={{ alignItems: 'center', gap: '$4i' }}>
            <Lift css={{ width: 18, height: 18, fill: '$green300' }} />
            <Text
              css={{
                fontSize: '$13',
                lineHeight: '$10i',
                fontWeight: 400,
                color: '$green300',
              }}>
              Lift
            </Text>
          </Row>
        ) : null}
        <Row css={{ alignItems: 'center', gap: '$4i' }}>
          {prime?.refundable ? (
            <Refundable css={{ width: 20, height: 20, fill: '$green300' }} />
          ) : (
            <NonRefundable css={{ width: 20, height: 20, fill: '$red300' }} />
          )}

          <Text
            css={{
              fontSize: '$13',
              lineHeight: '$10i',
              fontWeight: 400,
              color: prime?.refundable ? '$green300' : '$red300',
            }}>
            {prime?.refundable ? 'Refundable' : 'Non Refundable'}
          </Text>
        </Row>
      </Column>
    </Column>
  );
};

export default RoomDetails;
