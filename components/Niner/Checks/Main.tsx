import { Checkbox, Column, Row } from '@atom-web/micros';
import { HTTPError } from '@plato/api-core';
import { useAtomValue } from 'jotai';
import { Session } from 'next-auth';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { useUpdateNinerApplicableChecks } from '@actions/useUpdateNinerApplicableChecks';
import { useUpdateNinerChecks } from '@actions/useUpdateNinerChecks';
import {
  CostEntity,
  NinerChecksEntity,
  RemainingEntityOrQuestion,
} from '@apis/fetchNinerChecksQuestions';
import { EmployeeWithRole } from '@apis/fetchUser';
import StyledButton from '@components/Button';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import { trailIdAtom } from '@store/costsheetAtom';
import withSession from '@utils/withSession';

import { calculateTotalChecks } from '../utils/calculateTotalChecks';
import { calculateTotalMarkedChecks } from '../utils/calculateTotalMarkedChecks';
import { calculateTotalNotApplicableChecks } from '../utils/calculateTotalNotApplicableChecks';

type CheckProps = {
  session: Session;
  loginUser: EmployeeWithRole;
  expanded?: boolean;
  ninerData?: CostEntity[];
  ninerRefetch: () => void;
};

const Check = ({ session, expanded, ninerData, ninerRefetch }: CheckProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const trailId = useAtomValue(trailIdAtom);

  const { updateNinerCheckAsync, isLoading: isNinerLoading } =
    useUpdateNinerChecks();

  const { updateApplicableChecksAsync, isLoading: isUpdateApplicableLoading } =
    useUpdateNinerApplicableChecks();

  const handleNinerCheck = useCallback(
    async (checked: boolean | string, item: NinerChecksEntity) => {
      try {
        const response = await toast.promise(
          updateNinerCheckAsync({
            authToken: session.accessToken,
            trail_id: trailId as number,
            question_id: item?.question?.id,
            niner_id: item.id,
            entity_id: item?.entity_id,
            entity_type: item?.entity_type,
            checked: checked ? 1 : 0,
          }),
          {
            loading: 'updating niner..',
            success: 'Niner updated successfully',
            error: 'Niner not updated, try again!',
          },
        );
        if (response.status === 'SUCCESS') {
          ninerRefetch();
        }
      } catch (e) {
        if (e) {
          toast.error((e as unknown as HTTPError).message);
        }
      }
    },
    [ninerRefetch, trailId, session.accessToken, updateNinerCheckAsync],
  );

  const handleRemainingNinerCheck = useCallback(
    async (
      checked: boolean | string,
      item: RemainingEntityOrQuestion,
      ninerData: CostEntity,
    ) => {
      try {
        const response = await toast.promise(
          updateNinerCheckAsync({
            authToken: session.accessToken,
            trail_id: trailId as number,
            question_id: item?.id,
            entity_id: ninerData?.trail_cost_id,
            entity_type: item?.entity,
            checked: checked ? 1 : 0,
          }),
          {
            loading: 'updating niner..',
            success: 'Niner updated successfully',
            error: 'Niner not updated, try again!',
          },
        );
        if (response.status === 'SUCCESS') {
          ninerRefetch();
        }
      } catch (e) {
        if (e) {
          toast.error((e as unknown as HTTPError).message);
        }
      }
    },
    [ninerRefetch, trailId, session.accessToken, updateNinerCheckAsync],
  );

  const handleNinerChecksUpdateApplicable = useCallback(
    async (
      not_applicable: number,
      question_id: number,
      entity_id: number,
      entity_type: string,
      niner_id?: number,
    ) => {
      try {
        const response = await toast.promise(
          updateApplicableChecksAsync({
            authToken: session.accessToken,
            trail_id: trailId as number,
            not_applicable,
            entity_id,
            entity_type,
            question_id,
            niner_id,
          }),
          {
            loading: not_applicable
              ? 'Updating not applicable..'
              : 'Updating applicable..',
            success: not_applicable
              ? 'Not applicable updated successfully'
              : 'Applicable updated successfully',
            error: not_applicable
              ? 'Not applicable update failed, try again!'
              : 'Applicable update failed, try again',
          },
        );
        if (response.status === 'SUCCESS') {
          ninerRefetch();
        }
      } catch (e) {
        if (e) {
          toast.error((e as unknown as HTTPError).message);
        }
      }
    },
    [updateApplicableChecksAsync, session.accessToken, trailId, ninerRefetch],
  );

  const handleRemainingCheckUpdateApplicable = useCallback(
    async (
      not_applicable: number,
      question_id: number,
      entity_id: number,
      entity_type: string,
    ) => {
      try {
        const response = await toast.promise(
          updateApplicableChecksAsync({
            authToken: session.accessToken,
            trail_id: trailId as number,
            not_applicable,
            entity_id,
            entity_type,
            question_id,
          }),
          {
            loading: 'Updating not applicable..',
            success: 'Not applicable updated successfully',
            error: 'Not applicable update failed, try again!',
          },
        );
        if (response.status === 'SUCCESS') {
          ninerRefetch();
        }
      } catch (e) {
        if (e) {
          toast.error((e as unknown as HTTPError).message);
        }
      }
    },
    [updateApplicableChecksAsync, session.accessToken, trailId, ninerRefetch],
  );

  const totalChecks = calculateTotalChecks(ninerData);
  const totalChecksMarked = calculateTotalMarkedChecks(ninerData);
  const totalNotApplicableCount = calculateTotalNotApplicableChecks(ninerData);

  return (
    <Column css={{ gap: '$3i' }}>
      <Row css={{ gap: '$4i', alignItems: 'center' }}>
        <Text
          css={{
            fontSize: '$13',
            color: '$grey700',
            fontWeight: '500',
            lineHeight: '$10i',
          }}>
          {totalChecksMarked}/{totalChecks} Checks Marked{' '}
          {totalNotApplicableCount > 0 &&
            ` and ${totalNotApplicableCount} Not Applicable`}
        </Text>
      </Row>

      {!expanded ? (
        <Text
          css={{
            fontSize: '$13',
            color: '$blue300',
            fontWeight: '600',
            lineHeight: '$10i',
            textDecorationLine: 'underline',
          }}>
          View all checks
        </Text>
      ) : (
        <Column css={{ gap: '$2i' }}>
          {ninerData?.map((data, dataIndex) => (
            <React.Fragment key={dataIndex}>
              {data?.niner_checks?.map(item => {
                return (
                  <Row
                    key={item.id}
                    css={{ alignItems: 'center', gap: '$8i' }}
                    onMouseEnter={() => setHoveredIndex(item.id)}
                    onMouseLeave={() => setHoveredIndex(null)}>
                    <Row
                      css={{
                        gap: '$4i',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        alignSelf: 'stretch',
                        padding: '$3i $2i',
                        minHeight: '36px',
                        width: '75%',
                        borderRadius: hoveredIndex === item.id ? '$2' : '0',
                        background:
                          hoveredIndex === item?.id ? '$grey300' : 'none',
                      }}>
                      <Column css={{ gap: '$6i', flex: 1, width: '100%' }}>
                        <Row
                          css={{
                            gap: '$4i',
                            alignItems: 'center',
                          }}>
                          <Checkbox
                            size="1"
                            css={{
                              '&[aria-checked="true"]': {
                                backgroundColor: '$blue300',
                                color: '$grey100',
                              },
                            }}
                            checked={item.checked === 1}
                            onCheckedChange={checked =>
                              handleNinerCheck(checked, item)
                            }
                            disabled={
                              isNinerLoading || item.not_applicable === 1
                            }
                          />
                          <Text
                            css={{
                              fontSize: '$13',
                              fontWeight: '400',
                              color:
                                item.not_applicable === 1
                                  ? '$grey500'
                                  : '$grey700',
                              textDecoration:
                                item.not_applicable === 1
                                  ? 'line-through'
                                  : 'none',
                              lineHeight: '$10i',
                              flex: 1,
                            }}>
                            {item?.question?.question}
                          </Text>
                        </Row>
                      </Column>
                    </Row>
                    {hoveredIndex === item.id && (
                      <>
                        {item.not_applicable === 1 && (
                          <StyledButton
                            css={{ padding: '$3i $6i', width: 'fit-content' }}
                            disabled={
                              isUpdateApplicableLoading || item?.checked === 1
                            }
                            onClick={() =>
                              handleNinerChecksUpdateApplicable(
                                0,
                                item?.question_id,
                                item.entity_id,
                                item.entity_type,
                                item.id,
                              )
                            }
                            secondary>
                            <Text
                              css={{
                                fontSize: '$13',
                                color: '$grey700',
                                fontWeight: '500',
                                lineHeight: '$10i',
                              }}>
                              Applicable
                            </Text>
                          </StyledButton>
                        )}

                        {item.not_applicable === 0 && (
                          <StyledButton
                            css={{ padding: '$3i $6i', width: 'fit-content' }}
                            onClick={() =>
                              handleNinerChecksUpdateApplicable(
                                1,
                                item?.question_id,
                                item.entity_id,
                                item.entity_type,
                                item.id,
                              )
                            }
                            disabled={
                              isUpdateApplicableLoading || item?.checked === 1
                            }
                            secondary>
                            <Text
                              css={{
                                fontSize: '$13',
                                color: '$grey700',
                                fontWeight: '500',
                                lineHeight: '$10i',
                              }}>
                              Not Applicable
                            </Text>
                          </StyledButton>
                        )}
                      </>
                    )}
                  </Row>
                );
              })}
              {data?.remaining?.map(item => (
                <Row
                  key={item.id}
                  css={{ alignItems: 'center', gap: '$8i' }}
                  onMouseEnter={() => setHoveredIndex(item?.id)}
                  onMouseLeave={() => setHoveredIndex(null)}>
                  <Row
                    css={{
                      gap: '$4i',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      alignSelf: 'stretch',
                      padding: '$3i $2i',
                      minHeight: '34px',
                      width: '75%',
                      borderRadius: hoveredIndex === item.id ? '$2' : '0',
                      background:
                        hoveredIndex === item.id ? '$grey300' : 'none',
                    }}>
                    <Row
                      css={{
                        gap: '$4i',
                        alignItems: 'center',
                      }}>
                      <Checkbox
                        size="1"
                        css={{
                          '&[aria-checked="true"]': {
                            backgroundColor: '$blue300',
                            color: '$grey100',
                          },
                        }}
                        onCheckedChange={checked =>
                          handleRemainingNinerCheck(checked, item, data)
                        }
                        disabled={isNinerLoading}
                      />
                      <Text
                        css={{
                          fontSize: '$13',
                          color: '$grey700',
                          fontWeight: '400',
                          lineHeight: '$10i',
                          flex: 1,
                        }}>
                        {item?.question}
                      </Text>
                    </Row>
                  </Row>
                  {hoveredIndex === item.id && (
                    <StyledButton
                      css={{ padding: '$3i $6i', width: 'fit-content' }}
                      onClick={() =>
                        handleRemainingCheckUpdateApplicable(
                          1,
                          item.id,
                          data?.trail_cost_id,
                          item.entity,
                        )
                      }
                      disabled={isUpdateApplicableLoading}
                      secondary>
                      <Text
                        css={{
                          fontSize: '$13',
                          color: '$grey700',
                          fontWeight: '500',
                          lineHeight: '$10i',
                        }}>
                        Not Applicable
                      </Text>
                    </StyledButton>
                  )}
                </Row>
              ))}
            </React.Fragment>
          ))}
        </Column>
      )}
    </Column>
  );
};

export default withSession<CheckProps>(Check, FullShimmer);
