import { Column } from '@atom-web/micros';
import { useAtomValue, useSetAtom } from 'jotai';
import { Session } from 'next-auth';
import React, { useEffect } from 'react';

import { EmployeeWithRole } from '@apis/fetchUser';
import ErrorComponent from '@components/ErrorComponent';
import TrailSecondarySideBar from '@components/SideBars/Trail/Secondary';
import FullShimmer from '@components/Skeleton/FullShimmer';
import useTypedRouter from '@hooks/useTypedRouter';
import { trailInfoAtom, trailIdAtom } from '@store/costsheetAtom';
import withSession from '@utils/withSession';
import withTeam from '@utils/withTeam';

import AliasLoader from '../AliasLoader';
import TrailHeader from '../Header/Main';
import TrailSecondaryLayout from '../SecondaryLayout';

import Data from './Data';

type NinerPageProps = {
  session: Session;
  loginUser: EmployeeWithRole;
  loginUserReportees: EmployeeWithRole[];
  onClick: () => void;
  visible: boolean;
};

const NinerPage = ({
  session,
  loginUser,
  loginUserReportees,
  onClick,
  visible,
}: NinerPageProps) => {
  const router = useTypedRouter<{
    slug: number;
  }>();
  const [, isTrailError] = useAtomValue(trailInfoAtom);
  const setTrailId = useSetAtom(trailIdAtom);

  useEffect(() => {
    setTrailId(router.query.slug);
  }, [setTrailId, router]);

  if (isTrailError) {
    return (
      <Column
        align="center"
        justify="center"
        css={{
          width: '100%',
          height: '100%',
        }}>
        <ErrorComponent
          title="Trail Not Found"
          subText={`The given trail - ${router.query.slug} doesnt exists!`}
        />
      </Column>
    );
  }

  if (!router.query.slug) {
    return <FullShimmer />;
  }

  return (
    <TrailSecondaryLayout
      sidebar={<TrailSecondarySideBar onClick={onClick} />}
      visible={visible}
      header={<TrailHeader />}>
      <AliasLoader>
        {(trailId: number) => {
          return (
            <Data
              session={session}
              loginUser={loginUser}
              loginUserReportees={loginUserReportees}
              trailId={trailId}
            />
          );
        }}
      </AliasLoader>
    </TrailSecondaryLayout>
  );
};

NinerPage.access = 'view:costsheet';

export default withTeam(withSession(NinerPage, FullShimmer), FullShimmer);
