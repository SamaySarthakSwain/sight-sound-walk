import { defineMcp } from "@lovable.dev/mcp-js";
import searchMonuments from "./tools/search-monuments";
import getMonumentDetails from "./tools/get-monument";
import searchHotels from "./tools/search-hotels";
import searchFoodPlaces from "./tools/search-food";

export default defineMcp({
  name: "lets-explore-mcp",
  title: "Lets Explore (Odisha) MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Lets Explore Odisha educational tourism app. Use `search_monuments` and `get_monument_details` for temples, beaches, and heritage sites; `search_hotels` for stays; `search_food_places` for restaurants and street food. All tools are read-only over the public catalog.",
  tools: [searchMonuments, getMonumentDetails, searchHotels, searchFoodPlaces],
});
