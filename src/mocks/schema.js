import { buildSchema, GraphQLError } from "graphql";
import { travelOptions } from "./data.js";

export const schema = buildSchema(`
  type Flight {
    id: ID! destinationId: ID! airline: String! origin: String! arrival: String!
    departureDate: String! returnDate: String! departureTime: String! arrivalTime: String!
    duration: String! stops: Int! price: Int! currency: String! availableSeats: Int!
  }
  type Hotel {
    id: ID! destinationId: ID! name: String! area: String! stars: Int!
    pricePerNight: Int! currency: String! availableRooms: Int!
    checkIn: String! checkOut: String! amenities: [String!]!
  }
  type TravelOptions { id: ID! destinationId: ID! flights: [Flight!] hotels: [Hotel!] }
  type Query { travelOptions(destinationId: ID!): TravelOptions }
`);

export function createResolvers(scenario = "normal") {
  return {
    travelOptions({ destinationId }) {
      const result = travelOptions[destinationId];
      if (!result)
        throw new GraphQLError("El destino solicitado no existe.", {
          extensions: { code: "NOT_FOUND" },
        });
      if (scenario === "empty") return { ...result, flights: [], hotels: [] };
      if (scenario === "graphql")
        throw new GraphQLError(
          "No pudimos consultar las alternativas de viaje.",
          { extensions: { code: "SERVICE_UNAVAILABLE" } },
        );
      if (scenario === "partial")
        return {
          ...result,
          hotels: () => {
            throw new GraphQLError(
              "El servicio de hoteles está temporalmente ocupado.",
              { extensions: { code: "SERVICE_UNAVAILABLE" } },
            );
          },
        };
      return result;
    },
  };
}
