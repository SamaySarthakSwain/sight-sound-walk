// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tour_guide_service.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MonumentVisit _$MonumentVisitFromJson(Map<String, dynamic> json) =>
    MonumentVisit(
      monumentName: json['monumentName'] as String,
      location: json['location'] as String,
      era: json['era'] as String,
      atmosphere: json['atmosphere'] as String,
      description: json['description'] as String,
    );

Map<String, dynamic> _$MonumentVisitToJson(MonumentVisit instance) =>
    <String, dynamic>{
      'monumentName': instance.monumentName,
      'location': instance.location,
      'era': instance.era,
      'atmosphere': instance.atmosphere,
      'description': instance.description,
    };

// dart format off

// **************************************************************************
// RetrofitGenerator
// **************************************************************************

// ignore_for_file: unnecessary_brace_in_string_interps,no_leading_underscores_for_local_identifiers,unused_element,unnecessary_string_interpolations,unused_element_parameter,avoid_unused_constructor_parameters,unreachable_from_main

class _TourGuideService implements TourGuideService {
  _TourGuideService(this._dio, {this.baseUrl, this.errorLogger}) {
    baseUrl ??= 'http://localhost:8087';
  }

  final Dio _dio;

  String? baseUrl;

  final ParseErrorLogger? errorLogger;

  @override
  Future<String> getNarrative(MonumentVisit visit) async {
    final _extra = <String, dynamic>{};
    final queryParameters = <String, dynamic>{};
    final _headers = <String, dynamic>{};
    final _data = <String, dynamic>{};
    _data.addAll(visit.toJson());
    final _options = _setStreamType<String>(
      Options(method: 'POST', headers: _headers, extra: _extra)
          .compose(
            _dio.options,
            '/hello-tour',
            queryParameters: queryParameters,
            data: _data,
          )
          .copyWith(baseUrl: _combineBaseUrls(_dio.options.baseUrl, baseUrl)),
    );
    final _result = await _dio.fetch<String>(_options);
    late String _value;
    try {
      _value = _result.data!;
    } on Object catch (e, s) {
      errorLogger?.logError(e, s, _options, response: _result);
      rethrow;
    }
    return _value;
  }

  RequestOptions _setStreamType<T>(RequestOptions requestOptions) {
    if (T != dynamic &&
        !(requestOptions.responseType == ResponseType.bytes ||
            requestOptions.responseType == ResponseType.stream)) {
      if (T == String) {
        requestOptions.responseType = ResponseType.plain;
      } else {
        requestOptions.responseType = ResponseType.json;
      }
    }
    return requestOptions;
  }

  String _combineBaseUrls(String dioBaseUrl, String? baseUrl) {
    if (baseUrl == null || baseUrl.trim().isEmpty) {
      return dioBaseUrl;
    }

    final url = Uri.parse(baseUrl);

    if (url.isAbsolute) {
      return url.toString();
    }

    return Uri.parse(dioBaseUrl).resolveUri(url).toString();
  }
}

// dart format on
