import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'providers/map_controller_provider.dart';

class ExploreScreen extends ConsumerStatefulWidget {
  const ExploreScreen({super.key});

  @override
  ConsumerState<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends ConsumerState<ExploreScreen> {
  // Temporary mock data for testing UI before backend connection
  final List<Map<String, dynamic>> _mockMonuments = [
    {
      'id': 1,
      'name': 'India Gate',
      'latitude': 28.6129,
      'longitude': 77.2295,
      'description': 'A war memorial located astride the Rajpath.',
    },
    {
      'id': 2,
      'name': 'Red Fort',
      'latitude': 28.6562,
      'longitude': 77.2410,
      'description': 'A historic fort in the city of Delhi.',
    }
  ];

  @override
  void initState() {
    super.initState();
    // Load monuments shortly after map init
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(mapControllerProvider.notifier).updateMarkers(_mockMonuments);
    });
  }

  @override
  Widget build(BuildContext context) {
    final mapState = ref.watch(mapControllerProvider);

    return Scaffold(
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: mapState.initialPosition,
            markers: mapState.markers,
            mapType: MapType.normal,
            // Essential settings for the "3D Tour" feel
            buildingsEnabled: true,
            tiltGesturesEnabled: true,
            compassEnabled: true,
            myLocationEnabled: true,
            myLocationButtonEnabled: false,
            onMapCreated: (GoogleMapController controller) {
              ref.read(mapControllerProvider.notifier).setMapController(controller);
            },
          ),
          
          // Custom Top App Bar overlay for immersive look
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            left: 16,
            right: 16,
            child: Card(
              elevation: 8,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  children: [
                    const Icon(Icons.search, color: Colors.grey),
                    const SizedBox(width: 8),
                    const Expanded(
                      child: Text(
                        'Search Monuments...',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.filter_list),
                      onPressed: () {
                        // Filter Logic
                      },
                    )
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Pan camera to India Gate with high 3D tilt
          ref.read(mapControllerProvider.notifier)
             .animateTo(const LatLng(28.6129, 77.2295));
        },
        label: const Text('Start 3D Tour'),
        icon: const Icon(Icons.threed_rotation),
      ),
    );
  }
}
