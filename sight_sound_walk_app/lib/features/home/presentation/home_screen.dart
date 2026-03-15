import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: MediaQuery.of(context).size.height * 0.8,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text(
                'EXPLORE WITHOUT LIMITS',
                style: TextStyle(
                  fontWeight: FontWeight.w900,
                  shadows: [Shadow(color: Colors.black54, blurRadius: 10)],
                ),
              ),
              titlePadding: const EdgeInsets.only(left: 16, bottom: 40),
              background: Stack(
                fit: StackFit.expand,
                children: [
                   Container(
                     color: Colors.deepPurple[900], // Placeholder for hero image
                     child: const Center(
                       child: Icon(Icons.terrain, size: 100, color: Colors.white24),
                     ),
                   ),
                  const DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.black87],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                const Text(
                  'FEATURED DESTINATIONS',
                  style: TextStyle(
                    fontSize: 12,
                    letterSpacing: 2,
                    color: AppColors.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Creative Explorations',
                  style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 32),
                _buildDestinationCard(
                  context,
                  title: 'Ancient Monasteries',
                  description: 'Walk through centuries-old Buddhist ruins perched atop misty hills.',
                  label: 'Heritage',
                  icon: Icons.temple_buddhist,
                ),
                const SizedBox(height: 24),
                _buildDestinationCard(
                  context,
                  title: 'Golden Shores',
                  description: 'Sun-kissed beaches where ancient maritime history meets golden sunsets.',
                  label: 'Coastal',
                  icon: Icons.beach_access,
                ),
                const SizedBox(height: 48),
                Center(
                  child: OutlinedButton(
                    onPressed: () => context.go('/explore'),
                    child: const Text('VIEW ALL DESTINATIONS'),
                  ),
                ),
                const SizedBox(height: 80),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDestinationCard(BuildContext context, {required String title, required String description, required String label, required IconData icon}) {
    // Determine if desktop or mobile sizing roughly
    final isDesktop = MediaQuery.of(context).size.width > 768;
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      clipBehavior: Clip.antiAlias,
      child: isDesktop 
        ? Row(
            children: [
              Expanded(
                flex: 3,
                child: Container(
                  height: 300,
                  color: Colors.grey[200],
                  child: Center(child: Icon(icon, size: 64, color: AppColors.primary)),
                ),
              ),
              Expanded(
                flex: 2,
                child: Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Chip(label: Text(label), backgroundColor: AppColors.secondary),
                      const SizedBox(height: 16),
                      Text(title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      Text(description, style: const TextStyle(fontSize: 16)),
                    ],
                  ),
                ),
              ),
            ],
          )
        : Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 200,
                color: Colors.grey[200],
                width: double.infinity,
                child: Center(child: Icon(icon, size: 64, color: AppColors.primary)),
              ),
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Chip(label: Text(label), backgroundColor: AppColors.secondary),
                    const SizedBox(height: 16),
                    Text(title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 16),
                    Text(description, style: const TextStyle(fontSize: 16)),
                  ],
                ),
              ),
            ],
          ),
    );
  }
}
