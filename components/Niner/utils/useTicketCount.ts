// import { useEffect, useState } from 'react';

// import {
//   NinerChecks,
//   NinerChecksEntity,
// } from '@apis/fetchNinerChecksQuestions';

// interface TicketCount {
//   totalTickets: number;
//   closedTickets: number;
// }

// const useTicketCount = (ninerResponse?: NinerChecks | null): TicketCount => {
//   const [totalTickets, setTotalTickets] = useState<number>(0);
//   const [closedTickets, setClosedTickets] = useState<number>(0);

//   useEffect(() => {
//     if (ninerResponse && ninerResponse.cost && ninerResponse.trail) {
//       const { cost, trail } = ninerResponse;

//       const calculateTickets = (checks?: NinerChecksEntity[]) => {
//         return (
//           checks?.reduce(
//             (acc, check) => {
//               if (check.ticket && check.ticket.status) {
//                 acc.total++;
//                 if (
//                   check.ticket.status.name &&
//                   check.ticket.status.name.toLocaleLowerCase() === 'closed'
//                 ) {
//                   acc.closed++;
//                 }
//               }
//               return acc;
//             },
//             { total: 0, closed: 0 },
//           ) ?? { total: 0, closed: 0 }
//         );
//       };

//       const { total: costTotal, closed: costClosed } = cost.reduce(
//         (acc, costItem) => {
//           if (costItem.niner_checks) {
//             const { total, closed } = calculateTickets(costItem.niner_checks);
//             acc.total += total;
//             acc.closed += closed;
//           }
//           return acc;
//         },
//         { total: 0, closed: 0 },
//       );

//       const { total: trailTotal, closed: trailClosed } = calculateTickets(
//         trail.niner_checks,
//       );

//       const total = costTotal + trailTotal;
//       const closed = costClosed + trailClosed;

//       setTotalTickets(total);
//       setClosedTickets(closed);
//     } else {
//       setTotalTickets(0);
//       setClosedTickets(0);
//     }
//   }, [ninerResponse]);

//   return { totalTickets, closedTickets };
// };

// export default useTicketCount;
