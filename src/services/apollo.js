import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
export function createApolloClient() {
  const uri =
    import.meta.env.VITE_GRAPHQL_URL ||
    new URL(`${import.meta.env.BASE_URL}graphql`, window.location.href).href;
  return new ApolloClient({
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-first",
        errorPolicy: "all",
        notifyOnNetworkStatusChange: true,
      },
    },
  });
}
export const TRAVEL_OPTIONS = gql`
  query TravelOptions($destinationId: ID!) {
    travelOptions(destinationId: $destinationId) {
      id
      destinationId
      flights {
        id
        destinationId
        airline
        origin
        arrival
        departureDate
        returnDate
        departureTime
        arrivalTime
        duration
        stops
        price
        currency
        availableSeats
      }
      hotels {
        id
        destinationId
        name
        area
        stars
        pricePerNight
        currency
        availableRooms
        checkIn
        checkOut
        amenities
      }
    }
  }
`;
