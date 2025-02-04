export interface FlightSearchResults{
    status: boolean
    timestamp: number
    sessionId: string
    data: Data
  }
  
   interface Data {
    context: Context
    itineraries: Itinerary[]
    messages: any[]
    filterStats: FilterStats
    flightsSessionId: string
    destinationImageUrl: string
  }
  
   interface Context {
    status: string
    sessionId: string
    totalResults: number
  }
  
 export   interface Itinerary {
    id: string
    price: Price
    legs: Leg[]
    isSelfTransfer: boolean
    isProtectedSelfTransfer: boolean
    farePolicy: FarePolicy
    fareAttributes: FareAttributes
    tags?: string[]
    isMashUp: boolean
    hasFlexibleOptions: boolean
    score: number
  }
  
   interface Price {
    raw: number
    formatted: string
    pricingOptionId: string
  }
  
  export interface Leg {
    id: string
    origin: Origin
    destination: Destination
    durationInMinutes: number
    stopCount: number
    isSmallestStops: boolean
    departure: string
    arrival: string
    timeDeltaInDays: number
    carriers: Carriers
    segments: Segment[]
  }
  
   interface Origin {
    id: string
    entityId: string
    name: string
    displayCode: string
    city: string
    country: string
    isHighlighted: boolean
  }
  
   interface Destination {
    id: string
    entityId: string
    name: string
    displayCode: string
    city: string
    country: string
    isHighlighted: boolean
  }
  
   interface Carriers {
    marketing: Marketing[]
    operationType: string
    operating?: Operating[]
  }
  
   interface Marketing {
    id: number
    alternateId: string
    logoUrl: string
    name: string
  }
  
   interface Operating {
    id: number
    alternateId: string
    logoUrl: string
    name: string
  }
  
   interface Segment {
    id: string
    origin: Origin2
    destination: Destination2
    departure: string
    arrival: string
    durationInMinutes: number
    flightNumber: string
    marketingCarrier: MarketingCarrier
    operatingCarrier: OperatingCarrier
  }
  
   interface Origin2 {
    flightPlaceId: string
    displayCode: string
    parent: Parent
    name: string
    type: string
    country: string
    city:string
  }
  
   interface Parent {
    flightPlaceId: string
    displayCode: string
    name: string
    type: string
  }
  
   interface Destination2 {
    flightPlaceId: string
    displayCode: string
    city:string
    parent: Parent2
    name: string
    type: string
    country: string
  }
  
   interface Parent2 {
    flightPlaceId: string
    displayCode: string
    name: string
    type: string
  }
  
   interface MarketingCarrier {
    id: number
    name: string
    alternateId: string
    logo:string
    allianceId: number
    displayCode: string
  }
  
   interface OperatingCarrier {
    id: number
    name: string
    alternateId: string
    allianceId: number
    displayCode: string
  }
  
   interface FarePolicy {
    isChangeAllowed: boolean
    isPartiallyChangeable: boolean
    isCancellationAllowed: boolean
    isPartiallyRefundable: boolean
  }
  
   interface FareAttributes {}
  
   interface FilterStats {
    duration: Duration
    airports: Airport[]
    carriers: Carrier[]
    stopPrices: StopPrices
  }
  
   interface Duration {
    min: number
    max: number
    multiCityMin: number
    multiCityMax: number
  }
  
   interface Airport {
    city: string
    airports: Airport2[]
  }
  
   interface Airport2 {
    id: string
    entityId: string
    name: string
  }
  
   interface Carrier {
    id: number
    alternateId: string
    logoUrl: string
    name: string
  }
  
   interface StopPrices {
    direct: Direct
    one: One
    twoOrMore: TwoOrMore
  }
  
   interface Direct {
    isPresent: boolean
    formattedPrice: string
  }
  
   interface One {
    isPresent: boolean
    formattedPrice: string
  }
  
   interface TwoOrMore {
    isPresent: boolean
  }
  

  

  export interface FlightDetail {
    status: boolean
    timestamp: number
    data: FlightDetailData
  }
  
  export interface FlightDetailData {
    itinerary: FlightDetailItinerary
    pollingCompleted: boolean
  }
  
  export interface FlightDetailItinerary {
    legs: Leg[]
    pricingOptions: PricingOption[]
    isTransferRequired: boolean
    destinationImage: string
    operatingCarrierSafetyAttributes: OperatingCarrierSafetyAttribute[]
    flexibleTicketPolicies: any[]
  }
  
  export interface Leg {
    id: string
    origin: Origin
    destination: Destination
    segments: Segment[]
    duration: number
    stopCount: number
    departure: string
    arrival: string
    dayChange: number
  }
  

 
  

  

  
  export interface PricingOption {
    agents: Agent[]
    totalPrice: number
  }
  
  export interface Agent {
    id: string
    name: string
    isCarrier: boolean
    bookingProposition: string
    url: string
    price: number
    rating: Rating
    updateStatus: string
    segments: Segment2[]
    isDirectDBookUrl: boolean
    quoteAge: number
  }
  
  export interface Rating {
    value: number
    count: number
  }
  
  export interface Segment2 {
    id: string
    origin: Origin3
    destination: Destination3
    duration: number
    dayChange: number
    flightNumber: string
    departure: string
    arrival: string
    marketingCarrier: MarketingCarrier2
    operatingCarrier: OperatingCarrier2
  }
  
  export interface Origin3 {
    id: string
    name: string
    displayCode: string
    city: string
  }
  
  export interface Destination3 {
    id: string
    name: string
    displayCode: string
    city: string
  }
  
  export interface MarketingCarrier2 {
    id: string
    name: string
    displayCode: string
    displayCodeType: string
    logo: string
    altId: string
  }
  
  export interface OperatingCarrier2 {
    id: string
    name: string
    displayCode: string
    displayCodeType: string
    logo: string
    altId: string
  }
  
  export interface OperatingCarrierSafetyAttribute {
    carrierID: string
    carrierName: string
    faceMasksCompulsory: any
    aircraftDeepCleanedDaily: any
    attendantsWearPPE: any
    cleaningPacksProvided: any
    foodServiceChanges: any
    safetyUrl: any
  }
  

 