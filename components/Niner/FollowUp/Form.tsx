import { Box, Column, Divider, Row } from '@atom-web/micros';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { useSetAtom } from 'jotai';
import isEmpty from 'lodash.isempty';
import { Session } from 'next-auth';
import React, { Fragment, useCallback, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { useCreateFollowUp } from '@actions/useCreateFollowUp';
import { useGetFollowUpNotes } from '@actions/useGetFollowupNotes';
import { EmployeeWithRole } from '@apis/fetchUser';
import StyledButton from '@components/Button';
import LocalInput from '@components/Form/LocalInput';
import LocalTextArea from '@components/Form/LocalTextArea';
import FullShimmer from '@components/Skeleton/FullShimmer';
import Text from '@components/Text';
import { refreshCostSheetAtom } from '@store/costsheetAtom';
import withSession from '@utils/withSession';

type FormData = {
  date_and_time: string;
  remarks: string;
};
const schema = z.object({
  remarks: z.string(),
  date_and_time: z.string(),
});

const FollowUpForm = ({
  session,
  trailId,
}: {
  session: Session;
  loginUser: EmployeeWithRole;
  onClose: () => void;
  trailId: number;
}) => {
  const loadingTost = useRef<string>('');
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { data, isLoading, refetch } = useGetFollowUpNotes(
    {
      trail_id: trailId,
      authToken: session.accessToken,
    },
    {
      onSuccess() {
        toast.dismiss(loadingTost.current);
      },
      onError() {
        toast.dismiss(loadingTost.current);
      },
    },
  );

  const followupNotes = useMemo(() => data?.data || [], [data]);

  const { addFollowUpAsync } = useCreateFollowUp();
  const setTrailRefetch = useSetAtom(refreshCostSheetAtom);

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (trailId) {
        try {
          await toast.promise(
            addFollowUpAsync({
              authToken: session.accessToken,
              note: data.remarks,
              trailId: trailId,
              type: 'NINER_CHECK',
              follow_up_at: data.date_and_time,
            }),
            {
              loading: 'Adding follow up...',
              success: 'Follow up added successfully',
              error:
                'Unable to add followup  at the moment!. Please try again.',
            },
          );
          refetch();
         setTrailRefetch(Date.now());
        } catch {
          toast.error('Followup not added');
        }
      }
    },
    [addFollowUpAsync, refetch, session.accessToken, setTrailRefetch, trailId],
  );

  if (isLoading) {
    return <FullShimmer />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Row
          css={{
            alignItems: 'flex-start',
            flex: '1 0 0',
            alignSelf: 'stretch',
            background: '$grey100',
          }}>
          <Column
            css={{
              height: '658px',
              alignItems: 'flex-start',
              flex: '1 0 0',
              borderLeft: '1px solid $grey400',
            }}>
            <Row
              css={{
                padding: '$6i $12i',
                gap: '$8i',
                alignSelf: 'stretch',
                background: '$grey100',
              }}>
              <Text
                css={{
                  fontSize: '$13',
                  fontWeight: 700,
                  lineHeight: '$10i',
                  color: '$grey700',
                }}>
                Add Niner Reminder{' '}
              </Text>
            </Row>
            <Row
              css={{ background: '$grey300', width: '100%', height: '$4i' }}
            />
            <Column
              css={{
                padding: '$8i $12i $14i $12i',
                alignItems: 'flex-start',
                gap: '$12i',
                alignSelf: 'stretch',
                background: '$grey100',
                overflow: 'scroll',
              }}>
              <Row
                css={{
                  alignItems: 'flex-start',
                  gap: '$12i',
                  alignSelf: 'stretch',
                }}>
                <Column
                  css={{
                    width: '100%',
                    alignItems: 'flex-start',
                    gap: '$5i',
                  }}>
                  <Text
                    css={{
                      fontSize: '$13',
                      fontWeight: 500,
                      lineHeight: '$10i',

                      color: '$grey600',
                    }}>
                    Follow up Date and time:
                  </Text>
                  <Box css={{ width: '100%' }}>
                    <LocalInput<FormData, 'date_and_time'>
                      type="datetime-local"
                      name="date_and_time"
                    />
                  </Box>
                </Column>
              </Row>
              <Row
                css={{
                  alignItems: 'flex-start',
                  gap: '$12i',
                  alignSelf: 'stretch',
                }}>
                <Column
                  css={{
                    width: '100%',
                    alignItems: 'flex-start',
                    gap: '$5i',
                  }}>
                  <Text
                    css={{
                      fontSize: '$13',
                      fontWeight: 500,
                      lineHeight: '$10i',

                      color: '$grey600',
                    }}>
                    Remarks
                  </Text>
                  <Box css={{ width: '100%' }}>
                    <LocalTextArea
                      name="remarks"
                      inputCss={{ height: 160, minWidth: '100%' }}
                      inputWrapperCss={{ height: 160, minWidth: '100%' }}
                    />
                  </Box>
                </Column>
              </Row>
              {!isEmpty(followupNotes) ? (
                <>
                  <Divider css={{ background: '$grey400' }} />
                  <Column
                    css={{
                      width: '100%',
                      alignItems: 'flex-start',
                      gap: '$5i',
                    }}>
                    <Text
                      css={{
                        fontSize: '$13',
                        fontWeight: 700,
                        lineHeight: '$10i',
                        color: '$grey700',
                      }}>
                      Follow up History
                    </Text>
                    <Column
                      css={{ width: '100%', height: '100%', gap: '$10i' }}>
                      {followupNotes.map((note, index) => (
                        <Fragment key={index}>
                          <Column
                            css={{
                              width: '100%',
                              alignItems: 'flex-start',
                            }}>
                            <Column
                              css={{
                                width: '100%',
                                padding: '$10i $12i',
                                gap: '$6i',
                                background: '$grey100',
                                border: '1px solid $grey450',
                                borderRadius: '$3 $3 0 0 ',
                                flexWrap: 'wrap',
                              }}>
                              <Column
                                css={{
                                  gap: '$2i',
                                  width: '100%',
                                  flexWrap: 'wrap',
                                }}>
                                <Text
                                  css={{
                                    fontSize: '$7i',
                                    color: '$grey700',
                                    lineHeight: '$10i',
                                    fontWeight: 600,
                                  }}>
                                  {(note &&
                                    note.owner &&
                                    note.owner.username) ||
                                    '--'}
                                </Text>

                                <Text
                                  css={{
                                    fontSize: '$7i',
                                    color: '$grey700',
                                    lineHeight: '$10i',
                                    fontWeight: 400,
                                    flexWrap: 'wrap',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: '100%',
                                    wordBreak: 'break-word',
                                  }}>
                                  {note.notes || '--'}
                                </Text>
                              </Column>
                            </Column>
                            {!isEmpty(note.follow_up_at) && (
                              <Column
                                css={{
                                  padding: '$8i $12i',
                                  background: '$grey200',
                                  border: '1px solid $grey450',
                                  borderRadius: '$3',
                                  borderTopLeftRadius: 0,
                                  borderTopRightRadius: 0,
                                  borderTop: 0,
                                  width: '100%',
                                }}>
                                <Row css={{ gap: '$2i' }}>
                                  <Text
                                    css={{
                                      color: '$grey600',
                                      fontSize: '$13',
                                      lineHeight: '$10i',
                                      fontWeight: 500,
                                    }}>
                                    Follow Up:
                                  </Text>
                                  <Text
                                    css={{
                                      color: '$grey700',
                                      fontSize: '$13',
                                      lineHeight: '$10i',
                                      fontWeight: 600,
                                    }}>
                                    {note.follow_up_at !==
                                      '0000-00-00 00:00:00' &&
                                      format(
                                        parseISO(note.follow_up_at),
                                        'dd-MMM-yyyy HH:mm',
                                      )}
                                  </Text>
                                </Row>
                              </Column>
                            )}
                          </Column>
                        </Fragment>
                      ))}
                    </Column>
                  </Column>
                </>
              ) : null}
            </Column>
          </Column>
        </Row>
        <Column
          css={{
            alignItems: 'flex-start',
            flex: '1 0 0',
            alignSelf: 'stretch',
            background: '$grey100',
          }}>
          <Row
            css={{
              padding: '$6i $12i',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '$8i',
              alignSelf: 'stretch',
              background: '$grey100',
              boxShadow:
                '0px -4px 8px -2px rgba(16, 24, 40, 0.10), 0px -2px 4px -2px rgba(16, 24, 40, 0.06)',
            }}>
            <StyledButton
              secondary
              type="reset"
              css={{
                padding: '$4i $6i',
                width: 'fit-content',
              }}>
              <Text
                css={{
                  fontSize: '$13',
                  color: '$grey700',
                  fontWeight: '500',
                  lineHeight: '$10i',
                }}>
                Cancel
              </Text>
            </StyledButton>
            <StyledButton
              primary
              type="submit"
              css={{
                padding: '$4i $6i',
                width: 'fit-content',
              }}>
              <Text
                css={{
                  fontSize: '$13',
                  color: '$grey100',
                  fontWeight: '500',
                  lineHeight: '$10i',
                }}>
                Add Followup
              </Text>
            </StyledButton>
          </Row>
        </Column>
      </form>
    </FormProvider>
  );
};

export default withSession(FollowUpForm, FullShimmer);
