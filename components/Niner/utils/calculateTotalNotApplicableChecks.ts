import { CostEntity } from '@apis/fetchNinerChecksQuestions';

export const calculateTotalNotApplicableChecks = (
  ninerData: CostEntity[] | undefined,
): number => {
  return (
    ninerData?.reduce((acc, data) => {
      const ninerNotApplicableChecks =
        data?.niner_checks?.filter(item => item.not_applicable === 1).length ??
        0;
      return acc + ninerNotApplicableChecks;
    }, 0) ?? 0
  );
};
