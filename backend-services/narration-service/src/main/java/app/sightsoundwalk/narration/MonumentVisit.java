package app.sightsoundwalk.narration;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MonumentVisit(
    @JsonProperty("monumentName") String monumentName,
    @JsonProperty("location") String location,
    @JsonProperty("era") String era, // e.g., "Ancient", "Medieval", "Modern"
    @JsonProperty("atmosphere") String atmosphere, // e.g., "Mystical", "Bustling", "Serene"
    @JsonProperty("description") String description
) {}
