import { Column } from '@atom-web/micros';
import { useAtomValue } from 'jotai';
import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';
import { Session } from 'next-auth';
import React, { Suspense, useMemo } from 'react';

import { CostEntities, HodLineResponse } from '@apis/fetchCostDataByTrailId';
import { HodOrHodCx } from '@apis/fetchHodPreview';
import { Employee, EmployeeWithRole } from '@apis/fetchUser';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import { trailInfoAtom } from '@store/costsheetAtom';
import withSession from '@utils/withSession';

import StayCxHodContent from '../../InternalCommunication/CxHods/StayCxHodContent';
import ActivityHodContent from '../../InternalCommunication/SalesHods/ActivityHodContent';
import CustomHodContent from '../../InternalCommunication/SalesHods/CustomHodContent';
import FerryHodContent from '../../InternalCommunication/SalesHods/FerryHodContent';
import FlightHodContent from '../../InternalCommunication/SalesHods/FlightHodContent';
import InsuranceHodContent from '../../InternalCommunication/SalesHods/InsuranceHodContent';
import PassHodContent from '../../InternalCommunication/SalesHods/PassHodContent';
import RentalCarHodContent from '../../InternalCommunication/SalesHods/RentalCarHodContent';
import TrainHodContent from '../../InternalCommunication/SalesHods/TrainHodContent';
import TransferHodContent from '../../InternalCommunication/SalesHods/TransferHodContent';
import VisaHodContent from '../../InternalCommunication/SalesHods/VisaHodContent';

type HODProps = {
  session: Session;
  loginUser: EmployeeWithRole;
  loginUserReportees?: Employee[];
  hodToCxResponse?: HodOrHodCx;
  from: string;
  trailCostId?: string;
};

const SalesHod = ({ session, loginUser, from, trailCostId }: HODProps) => {
  const [getTrailInfo] = useAtomValue(trailInfoAtom);

  const trailInfo = useMemo(() => {
    if (getTrailInfo) {
      return getTrailInfo;
    }
    return null;
  }, [getTrailInfo]);

  //filter activity entity from hod and line item
  const activityHod: HodLineResponse[] = useMemo(() => {
    const activityData = trailInfo?.hod_line_responses
      ? (trailInfo.hod_line_responses.filter(
          item =>
            item.cost_desc?.type === 3 &&
            item.hod_type === 3 &&
            item?.costing_id === trailCostId,
        ) as HodLineResponse[])
      : [];
    const uniqueData = uniqBy(activityData, item => item.cost_desc.name);
    const sortedData = sortBy(uniqueData, ['date']);

    return sortedData;
  }, [trailCostId, trailInfo]);

  //filter custom entity from hod and line item
  const customHod: HodLineResponse[] = useMemo(() => {
    const customData = trailInfo?.hod_line_responses
      ? (trailInfo.hod_line_responses.filter(
          item =>
            item.cost_desc?.type === 29 &&
            item.hod_type === 3 &&
            item?.costing_id === trailCostId,
        ) as HodLineResponse[])
      : [];
    const uniqueData = uniqBy(customData, item => item.cost_desc.name);
    const sortedData = sortBy(uniqueData, ['date']);

    return sortedData;
  }, [trailCostId, trailInfo]);

  //filter ferry entity from hod and line item
  const ferryHod: HodLineResponse[] = useMemo(() => {
    const ferryData = trailInfo?.hod_line_responses
      ? (trailInfo.hod_line_responses.filter(
          item =>
            item.cost_desc?.type === 6 &&
            item.hod_type === 3 &&
            item?.costing_id === trailCostId,
        ) as HodLineResponse[])
      : [];
    const uniqueData = uniqBy(ferryData, item => item.cost_desc.name);
    const sortedData = sortBy(uniqueData, ['date']);

    return sortedData;
  }, [trailCostId, trailInfo]);

  //filter flight entity from hod and line item
  const flightHod: HodLineResponse[] | CostEntities = useMemo(() => {
    const flightData = trailInfo?.hod_line_responses
      ? (trailInfo.hod_line_responses.filter(
          item =>
            item.cost_desc?.type === 1 &&
            item.hod_type === 3 &&
            item?.costing_id === trailCostId,
        ) as HodLineResponse[])
      : [];

    const uniqueData = uniqBy(flightData, item => item.cost_desc.name);
    const sortedData = sortBy(uniqueData, ['date']);

    return sortedData;
  }, [trailCostId, trailInfo]);

  //filter insurance entity from hod and line item
  const insuranceHod: HodLineResponse[] = useMemo(() => {
    const insuranceData = trailInfo?.hod_line_responses
      ? (trailInfo.hod_line_responses.filter(
          item =>
            item.cost_desc?.type === 10 &&
            item.hod_type === 3 &&
            item?.costing_id === trailCostId,
        ) as HodLineResponse[])
      : [];
    const uniqueData = uniqBy(insuranceData, item => item.cost_desc.name);
    const sortedData = sortBy(uniqueData, ['date']);

    return sortedData;
  }, [trailCostId, trailInfo]);

  //filter pass entity from hod and line item
  const passHod: HodLineResponse[] = useMemo(() => {
    const passData = trailInfo?.hod_line_responses
      ? (trailInfo.hod_line_responses.filter(
          item =>
            item.cost_desc?.type === 8 &&
            item.hod_type === 3 &&
            item?.costing_id === trailCostId,
        ) as HodLineResponse[])
      : [];
    const uniqueData = uniqBy(passData, item => item.cost_desc.name);
    const sortedData = sortBy(uniqueData, ['date']);

    return sortedData;
  }, [trailCostId, trailInfo]);

  //filter rentalcar entity from hod and line item
  const rentalcarHod: HodLineResponse[] = useMemo(() => {
    const rentalCarData = trailInfo?.hod_line_responses
      ? (trailInfo.hod_line_responses.filter(
          item =>
            item.cost_desc?.type === 7 &&
            item.hod_type === 3 &&
            item?.costing_id === trailCostId,
        ) as HodLineResponse[])
      : [];
    const uniqueData = uniqBy(rentalCarData, item => item.cost_desc.name);
    const sortedData = sortBy(uniqueData, ['date']);

    return sortedData;
  }, [trailCostId, trailInfo]);

  //filter stay entity from hod and line item
  const stayHod: HodLineResponse[] = useMemo(() => {
    const stayData = trailInfo?.hod_line_responses
      ? (trailInfo.hod_line_responses.filter(
          item =>
            item.cost_desc?.type === 2 &&
            item.hod_type === 3 &&
            item?.costing_id === trailCostId,
        ) as HodLineResponse[])
      : [];
    const uniqueData = uniqBy(stayData, item => item.cost_desc.name);
    const sortedData = sortBy(uniqueData, ['date']);

    return sortedData;
  }, [trailCostId, trailInfo]);

  //filter train entity from hod and line item
  const trainHod: HodLineResponse[] = useMemo(() => {
    const trainData = trailInfo?.hod_line_responses
      ? (trailInfo.hod_line_responses.filter(
          item =>
            item.cost_desc?.type === 5 &&
            item.hod_type === 3 &&
            item?.costing_id === trailCostId,
        ) as HodLineResponse[])
      : [];
    const uniqueData = uniqBy(trainData, item => item.cost_desc.name);
    const sortedData = sortBy(uniqueData, ['date']);

    return sortedData;
  }, [trailCostId, trailInfo]);

  //filter transfer entity from hod and line item
  const transferHod: HodLineResponse[] = useMemo(() => {
    const transferData = trailInfo?.hod_line_responses
      ? (trailInfo.hod_line_responses.filter(
          item =>
            item.cost_desc?.type === 4 &&
            item.hod_type === 3 &&
            item?.costing_id === trailCostId,
        ) as HodLineResponse[])
      : [];
    const uniqueData = uniqBy(transferData, item => item.cost_desc.name);
    const sortedData = sortBy(uniqueData, ['date']);

    return sortedData;
  }, [trailCostId, trailInfo]);

  //filter visa entity from hod and line item
  const visaHod: HodLineResponse[] = useMemo(() => {
    const visaData = trailInfo?.hod_line_responses
      ? (trailInfo.hod_line_responses.filter(
          item =>
            item.cost_desc?.type === 9 &&
            item.hod_type === 3 &&
            item?.costing_id === trailCostId,
        ) as HodLineResponse[])
      : [];
    const uniqueData = uniqBy(visaData, item => item.cost_desc.name);
    const sortedData = sortBy(uniqueData, ['date']);

    return sortedData;
  }, [trailCostId, trailInfo]);

  const hasHODData = useMemo(() => {
    return (
      (flightHod.length && from === 'flight') ||
      (activityHod.length && from === 'activity') ||
      (stayHod.length && from === 'stay') ||
      (customHod.length && from === 'custom') ||
      (ferryHod.length && from === 'ferry') ||
      (trainHod.length && from === 'train') ||
      (transferHod.length && from === 'transfer') ||
      (passHod.length && from === 'pass') ||
      (insuranceHod.length && from === 'insurance') ||
      (rentalcarHod.length && from === 'rentalcar') ||
      (visaHod.length && from === 'visa')
    );
  }, [
    flightHod,
    from,
    activityHod,
    stayHod,
    customHod,
    ferryHod,
    trainHod,
    transferHod,
    rentalcarHod,
    insuranceHod,
    passHod,
    visaHod,
  ]);

  if (!hasHODData) {
    return (
      <Text
        css={{
          fontSize: '$13',
          color: '$red300',
          fontWeight: '400',
          lineHeight: '$10i',
        }}>
        No Sales HOD available for this lineitem!
      </Text>
    );
  }

  return (
    <Column css={{ width: '100%', overflow: 'scroll', gap: '$6i' }}>
      <Text
        css={{
          fontSize: '$7i',
          color: '$grey700',
          fontWeight: '600',
          lineHeight: '$10i',
        }}>
        SALES HOD
      </Text>
      <Column
        css={{
          width: '95%',
          height: '100%',
          gap: '$16i',
        }}>
        <Suspense>
          {from === 'flight' && flightHod && flightHod.length
            ? flightHod.map((hodContent, inx) => (
                <Column key={inx}>
                  <FlightHodContent
                    session={session}
                    loginUser={loginUser}
                    content={hodContent}
                  />
                </Column>
              ))
            : null}
          {from === 'activity' && activityHod && activityHod.length
            ? activityHod.map((hodContent, inx) => (
                <Column key={inx}>
                  <ActivityHodContent
                    session={session}
                    loginUser={loginUser}
                    content={hodContent}
                  />
                </Column>
              ))
            : null}

          {from === 'stay' && stayHod && stayHod.length
            ? stayHod.map((hodContent, inx) => (
                <Column key={inx}>
                  <StayCxHodContent
                    session={session}
                    loginUser={loginUser}
                    content={hodContent}
                  />
                </Column>
              ))
            : null}

          {from === 'custom' && customHod && customHod.length
            ? customHod.map((hodContent, inx) => (
                <Column key={inx}>
                  <CustomHodContent
                    session={session}
                    loginUser={loginUser}
                    content={hodContent}
                  />
                </Column>
              ))
            : null}
          {from === 'ferry' && ferryHod && ferryHod.length
            ? ferryHod.map((hodContent, inx) => (
                <Column key={inx}>
                  <FerryHodContent
                    session={session}
                    loginUser={loginUser}
                    content={hodContent}
                  />
                </Column>
              ))
            : null}
          {from === 'insurance' && insuranceHod && insuranceHod.length
            ? insuranceHod.map((hodContent, inx) => (
                <Column key={inx}>
                  <InsuranceHodContent
                    session={session}
                    loginUser={loginUser}
                    content={hodContent}
                  />
                </Column>
              ))
            : null}
          {from === 'pass' && passHod && passHod.length
            ? passHod.map((hodContent, inx) => (
                <Column key={inx}>
                  <PassHodContent
                    session={session}
                    loginUser={loginUser}
                    content={hodContent}
                  />
                </Column>
              ))
            : null}
          {from === 'rentalcar' && rentalcarHod && rentalcarHod.length
            ? rentalcarHod.map((hodContent, inx) => (
                <Column key={inx}>
                  <RentalCarHodContent
                    session={session}
                    loginUser={loginUser}
                    content={hodContent}
                  />
                </Column>
              ))
            : null}

          {from === 'train' && trainHod && trainHod.length
            ? trainHod.map((hodContent, inx) => (
                <Column key={inx}>
                  <TrainHodContent
                    session={session}
                    loginUser={loginUser}
                    content={hodContent}
                  />
                </Column>
              ))
            : null}
          {from === 'transfer' && transferHod && transferHod.length
            ? transferHod.map((hodContent, inx) => (
                <Column key={inx}>
                  <TransferHodContent
                    session={session}
                    loginUser={loginUser}
                    content={hodContent}
                  />
                </Column>
              ))
            : null}
          {from === 'visa' && visaHod && visaHod.length
            ? visaHod.map((hodContent, inx) => (
                <Column key={inx}>
                  <VisaHodContent
                    session={session}
                    loginUser={loginUser}
                    content={hodContent}
                  />
                </Column>
              ))
            : null}
        </Suspense>
      </Column>
    </Column>
  );
};

export default withSession<HODProps>(SalesHod, FullShimmer);
