// import { useEffect, useState } from 'react';

// import {
//   CostEntity,
//   NinerChecksEntity,
//   Trail,
// } from '@apis/fetchNinerChecksQuestions';

// interface Totals {
//   totalClosedTickets: number;
//   totalReopenedTickets: number;
//   totalOpenTickets: number;
//   totalOnHoldTickets: number;
// }

// type NinerData = CostEntity[] | Trail;

// const useTicketStatusCount = (ninerData: NinerData | undefined): Totals => {
//   const [totals, setTotals] = useState<Totals>({
//     totalClosedTickets: 0,
//     totalReopenedTickets: 0,
//     totalOpenTickets: 0,
//     totalOnHoldTickets: 0,
//   });

//   useEffect(() => {
//     const calculateTicketStatus = () => {
//       let totalClosedTickets = 0;
//       let totalReopenedTickets = 0;
//       let totalOpenTickets = 0;
//       let totalOnHoldTickets = 0;

//       if (Array.isArray(ninerData)) {
//         ninerData.forEach((data: CostEntity) => {
//           data.niner_checks?.forEach((item: NinerChecksEntity) => {
//             const ticketStatus = item?.ticket?.status?.name?.toLowerCase();
//             if (ticketStatus === 'closed') {
//               totalClosedTickets++;
//             } else if (ticketStatus === 'reopened') {
//               totalReopenedTickets++;
//             } else if (ticketStatus === 'open') {
//               totalOpenTickets++;
//             } else if (ticketStatus === 'on hold') {
//               totalOnHoldTickets++;
//             }
//           });
//         });
//       } else {
//         ninerData?.niner_checks?.forEach((item: NinerChecksEntity) => {
//           const ticketStatus = item?.ticket?.status?.name?.toLowerCase();
//           if (ticketStatus === 'closed') {
//             totalClosedTickets++;
//           } else if (ticketStatus === 'reopened') {
//             totalReopenedTickets++;
//           } else if (ticketStatus === 'open') {
//             totalOpenTickets++;
//           } else if (ticketStatus === 'on hold') {
//             totalOnHoldTickets++;
//           }
//         });
//       }

//       return {
//         totalClosedTickets,
//         totalReopenedTickets,
//         totalOpenTickets,
//         totalOnHoldTickets,
//       };
//     };

//     const {
//       totalClosedTickets,
//       totalReopenedTickets,
//       totalOpenTickets,
//       totalOnHoldTickets,
//     } = calculateTicketStatus();
//     setTotals({
//       totalClosedTickets,
//       totalReopenedTickets,
//       totalOpenTickets,
//       totalOnHoldTickets,
//     });
//   }, [ninerData]);

//   return totals;
// };

// export default useTicketStatusCount;
