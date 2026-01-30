import { Column, Row } from '@atom-web/micros';
import { Session } from 'next-auth';
import React from 'react';

import { PassportPan } from '@apis/fetchUploadsByTrail';
import { Employee, EmployeeWithRole } from '@apis/fetchUser';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import FormWrapper from '@components/Trail/CostSheet/FormWrapper';
import PassportOrPanUpload from '@components/Trail/Uploads/PassportPanUpload';
import UploadCard from '@components/Trail/Uploads/UploadCard';
import withSession from '@utils/withSession';
import withTeam from '@utils/withTeam';

type UploadsProps = {
  session: Session;
  loginUser: EmployeeWithRole;
  loginUserReportees: Employee[];
  docs?: PassportPan;
};

const PassportMain = ({ session, loginUser, docs }: UploadsProps) => {
  return (
    <Column
      css={{
        overflow: 'hidden',
        height: '100vh',
      }}>
      <Column
        css={{
          padding: '$10i $12i',
          borderBottom: '1px solid $colors$grey400',
        }}>
        <Text md css={{ fontWeight: '$semibold' }}>
          All Passports
        </Text>
      </Column>
      <Column
        css={{
          width: '100%',
          height: '100%',
          gap: '$10i',
          padding: '$12i $24i',
          overflow: 'scroll',
        }}>
        <Column>
          {(docs?.list || [])?.some(passportItem =>
            passportItem?.link?.startsWith('http'),
          ) ? (
            <FormWrapper
              content={
                <Row css={{ width: '100%', flexWrap: 'wrap', gap: '$16i' }}>
                  {(docs?.list || [])
                    ?.filter(passportItem =>
                      passportItem?.link?.startsWith('http'),
                    )
                    .map((passportItem, index) => (
                      <UploadCard
                        key={passportItem?.filename || index}
                        title={'Passport'}
                        link={passportItem?.link}
                        session={session}
                        loginUser={loginUser}
                      />
                    ))}
                </Row>
              }
              title={'Passports'}
              textStyle={true}
            />
          ) : (
            <PassportOrPanUpload
              title={'Passport'}
              invoices={(docs?.list || [])?.filter(
                invoice => !invoice.link.startsWith('http'),
              )}
              session={session}
              loginUser={loginUser}
            />
          )}
        </Column>
      </Column>
    </Column>
  );
};

export default withTeam(withSession(PassportMain, FullShimmer), FullShimmer);
