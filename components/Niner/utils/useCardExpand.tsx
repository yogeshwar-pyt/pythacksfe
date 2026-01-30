import { useState } from 'react';

export const useCardExpand = () => {

  const [genericCheckCard, setGenericCheckCard] = useState<boolean>(false);
  const [allCardExpand, setallCardExpand] = useState<boolean>(false);
  
  const [flightExpandedCardIndex, setFlightExpandedCardIndex] = useState<
    number | null
  >(null);
  const [hotelExpandedCardIndex, setHotelExpandedCardIndex] = useState<
    number | null
  >(null);
  const [activityExpandedCardIndex, setActivityExpandedCardIndex] = useState<
    number | null
  >(null);
  const [ferryExpandedCardIndex, setFerryExpandedCardIndex] = useState<
    number | null
  >(null);
  const [visaExpandedCardIndex, setVisaExpandedCardIndex] = useState<
    number | null
  >(null);
  const [transferExpandedCardIndex, setTransferExpandedCardIndex] = useState<
    number | null
  >(null);
  const [trainExpandedCardIndex, setTrainExpandedCardIndex] = useState<
    number | null
  >(null);
  const [rentalCarExpandedCardIndex, setRentalCarExpandedCardIndex] = useState<
    number | null
  >(null);
  const [passExpandedCardIndex, setPassExpandedCardIndex] = useState<
    number | null
  >(null);
  const [insuranceExpandedCardIndex, setInsuranceExpandedCardIndex] = useState<
    number | null
  >(null);
  const [customExpandedCardIndex, setCustomExpandedCardIndex] = useState<
    number | null
  >(null);

  const resetExpandedIndexes = () => {
    setFlightExpandedCardIndex(null);
    setHotelExpandedCardIndex(null);
    setActivityExpandedCardIndex(null);
    setFerryExpandedCardIndex(null);
    setVisaExpandedCardIndex(null);
    setTransferExpandedCardIndex(null);
    setTrainExpandedCardIndex(null);
    setRentalCarExpandedCardIndex(null);
    setPassExpandedCardIndex(null);
    setInsuranceExpandedCardIndex(null);
    setCustomExpandedCardIndex(null);
  };
  const handleAllCardsExpand = () => {
    resetExpandedIndexes();
    setallCardExpand(!allCardExpand); 
  };
  const handleToggle = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<number | null>>,
  ) => {
    resetExpandedIndexes();
    setter(prevState => (prevState === index ? null : index));
    setGenericCheckCard(false);

  };

  const handleGenericCheckCardToggle = () => {
    resetExpandedIndexes();
    setGenericCheckCard(true);
  };
  const handleGenericCheckCardCloseToggle = () => {
    resetExpandedIndexes();
    setGenericCheckCard(false);
  };
  const handleAllCardCollapse = () => {
    resetExpandedIndexes();
    setGenericCheckCard(false);
  };

  
  return {
    genericCheckCard,
    flightExpandedCardIndex,
    hotelExpandedCardIndex,
    activityExpandedCardIndex,
    ferryExpandedCardIndex,
    visaExpandedCardIndex,
    transferExpandedCardIndex,
    trainExpandedCardIndex,
    rentalCarExpandedCardIndex,
    passExpandedCardIndex,
    insuranceExpandedCardIndex,
    customExpandedCardIndex,
    allCardExpand,
    handleAllCardsExpand,
    handleGenericCheckCardToggle,
    handleGenericCheckCardCloseToggle,
    handleAllCardCollapse,
    handleFlightCardToggle: (index: number) =>
      handleToggle(index, setFlightExpandedCardIndex),
    handleHotelCardToggle: (index: number) =>
      handleToggle(index, setHotelExpandedCardIndex),
    handleActivityCardToggle: (index: number) =>
      handleToggle(index, setActivityExpandedCardIndex),
    handleFerryCardToggle: (index: number) =>
      handleToggle(index, setFerryExpandedCardIndex),
    handleVisaCardToggle: (index: number) =>
      handleToggle(index, setVisaExpandedCardIndex),
    handleTransferCardToggle: (index: number) =>
      handleToggle(index, setTransferExpandedCardIndex),
    handleTrainCardToggle: (index: number) =>
      handleToggle(index, setTrainExpandedCardIndex),
    handleRentalCarCardToggle: (index: number) =>
      handleToggle(index, setRentalCarExpandedCardIndex),
    handlePassCardToggle: (index: number) =>
      handleToggle(index, setPassExpandedCardIndex),
    handleInsuranceCardToggle: (index: number) =>
      handleToggle(index, setInsuranceExpandedCardIndex),
    handleCustomCardToggle: (index: number) =>
      handleToggle(index, setCustomExpandedCardIndex),
  };
};
