import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

// Represents the state of our 3D Map
class MapState {
  final Set<Marker> markers;
  final CameraPosition initialPosition;
  
  MapState({
    required this.markers,
    required this.initialPosition,
  });

  MapState copyWith({
    Set<Marker>? markers,
    CameraPosition? initialPosition,
  }) {
    return MapState(
      markers: markers ?? this.markers,
      initialPosition: initialPosition ?? this.initialPosition,
    );
  }
}

class MapControllerNotifier extends Notifier<MapState> {
  @override
  MapState build() {
    return MapState(
      markers: {},
      initialPosition: const CameraPosition(
        target: LatLng(28.6129, 77.2295), // Example: India Gate, New Delhi
        zoom: 15.0,
        tilt: 45.0, // Enable 3D tilt initially
      ),
    );
  }

  GoogleMapController? _mapController;

  void setMapController(GoogleMapController controller) {
    _mapController = controller;
  }

  // Called when monuments are fetched from the backend
  void updateMarkers(List<Map<String, dynamic>> monuments) {
    final newMarkers = monuments.map((monument) {
      return Marker(
        markerId: MarkerId(monument['id'].toString()),
        position: LatLng(monument['latitude'], monument['longitude']),
        infoWindow: InfoWindow(
          title: monument['name'],
          snippet: 'Tap to view details',
        ),
        onTap: () {
          // Handle marker tap
        },
      );
    }).toSet();

    state = state.copyWith(markers: newMarkers);
  }

  void animateTo(LatLng position) {
    _mapController?.animateCamera(
      CameraUpdate.newCameraPosition(
        CameraPosition(
          target: position,
          zoom: 17.0,
          tilt: 60.0, // High tilt for 3D monument viewing
        ),
      ),
    );
  }
}

final mapControllerProvider = NotifierProvider<MapControllerNotifier, MapState>(() {
  return MapControllerNotifier();
});
