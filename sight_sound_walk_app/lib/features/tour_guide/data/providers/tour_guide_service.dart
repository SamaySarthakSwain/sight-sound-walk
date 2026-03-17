import 'package:dio/dio.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:retrofit/retrofit.dart';

part 'tour_guide_service.g.dart';

@JsonSerializable()
class MonumentVisit {
  final String monumentName;
  final String location;
  final String era;
  final String atmosphere;
  final String description;

  MonumentVisit({
    required this.monumentName,
    required this.location,
    required this.era,
    required this.atmosphere,
    required this.description,
  });

  factory MonumentVisit.fromJson(Map<String, dynamic> json) => _$MonumentVisitFromJson(json);
  Map<String, dynamic> toJson() => _$MonumentVisitToJson(this);
}

@RestApi(baseUrl: "http://localhost:8087")
abstract class TourGuideService {
  factory TourGuideService(Dio dio, {String baseUrl}) = _TourGuideService;

  @POST("/hello-tour")
  Future<String> getNarrative(@Body() MonumentVisit visit);
}
