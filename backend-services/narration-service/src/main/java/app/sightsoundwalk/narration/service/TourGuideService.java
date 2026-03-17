package app.sightsoundwalk.narration.service;

import java.time.temporal.ChronoUnit;
import org.eclipse.microprofile.faulttolerance.CircuitBreaker;
import org.eclipse.microprofile.faulttolerance.Fallback;
import app.sightsoundwalk.narration.MonumentVisit;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.opentelemetry.instrumentation.annotations.SpanAttribute;
import io.opentelemetry.instrumentation.annotations.WithSpan;
import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService
public interface TourGuideService {

    String FALLBACK_NARRATION = """
        Step into the past where the stones speak of history long forgotten. 
        Marvel at the architecture that stood the test of time, an eternal beacon of culture.
        You are standing before a crown jewel of human achievement. 
        Enjoy the serene atmosphere and let your imagination wander.
        """;

    @SystemMessage("""
        You are a world-class historian, architect, and charismatic travel guide. 
        You excel at bringing monuments to life through vivid, multisensory narrations.
        You are expert in different historical eras and can adapt your tone to match specific 'Time Travel' settings.
        """)
    @UserMessage("""
        Narrate a visit to {visit.monumentName} during the {visit.era} era.
        
        The current atmosphere is: {visit.atmosphere}.
        Description: {visit.description}.

        In your narration:
        1. Capture the 'Sight' (visual details of that specific era) and the 'Sound' (ambient noises, music, voices).
        2. Speak directly to the 'Traveler' to ensure an immersive experience.
        3. Keep it within 3 or 4 paragraphs.
        
        Ensure the tone remains respectful, historical, and deeply engaging. 
        Do not use modern terms if the era is Ancient or Medieval.
        """)
    @Fallback(fallbackMethod = "narrateFallback")
    @CircuitBreaker(requestVolumeThreshold = 8, failureRatio = 0.5, delay = 2, delayUnit = ChronoUnit.SECONDS)
    @WithSpan("TourGuideService.narrate")
    String narrate(@SpanAttribute("arg.visit") MonumentVisit visit);

    default String narrateFallback(@SpanAttribute("arg.visit") MonumentVisit visit) {
        return FALLBACK_NARRATION;
    }
}
