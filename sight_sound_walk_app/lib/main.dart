import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'core/routing/app_router.dart';
import 'core/constants/app_colors.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await dotenv.load(fileName: ".env");

  // Initialize Supabase. Replace with actual keys via flutter_dotenv later if needed.
  await Supabase.initialize(
    url: 'https://eydofmtdkcshvgehdbyl.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZG9mbXRka2NzaHZnZWhkYnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NjY2MDksImV4cCI6MjA3OTM0MjYwOX0.YYGHhCu8iwTSm_-LqsJCOZzpUzYSVT5uo3-ApO-621M',
  );

  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: 'Sight Sound Walk',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      themeMode: ThemeMode.system,
      routerConfig: appRouter,
    );
  }
}
