package app.sightsoundwalk.narration.rest;

import java.util.concurrent.CompletionStage;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.logging.Logger;

import app.sightsoundwalk.narration.MonumentVisit;
import app.sightsoundwalk.narration.service.TourGuideService;
import io.opentelemetry.instrumentation.annotations.WithSpan;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.infrastructure.Infrastructure;

@Path("/hello-tour")
@Produces(MediaType.TEXT_PLAIN)
@Tag(name = "tour-guide")
public class TourGuideResource {

    private final TourGuideService tourGuideService;
    private final Logger logger;

    public TourGuideResource(TourGuideService tourGuideService, Logger logger) {
        this.tourGuideService = tourGuideService;
        this.logger = logger;
    }

    @GET
    @Operation(summary = "Health check for the tour guide service")
    public String hello() {
      return "Hello from the AI Tour Guide!";
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(summary = "Generate a tour narration for a monument")
    @APIResponse(responseCode = "200", description = "The generated narration", content = @Content(schema = @Schema(implementation = String.class)))
    @APIResponse(responseCode = "400", description = "Invalid monument data")
    @WithSpan("TourGuideResource.narrate")
    public Uni<String> narrate(
        @RequestBody(description = "The details of the monument visit", required = true, content = @Content(schema = @Schema(implementation = MonumentVisit.class)))
        @Valid @NotNull MonumentVisit visit) {

        this.logger.debugf("Narrating visit for monument: %s in era: %s", visit.monumentName(), visit.era());

        return Uni.createFrom().item(() -> this.tourGuideService.narrate(visit))
            .runSubscriptionOn(Infrastructure.getDefaultWorkerPool());
    }
}
