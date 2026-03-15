import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../layout/scaffold_with_navbar.dart';
import 'package:sight_sound_walk_app/features/home/presentation/home_screen.dart';
import 'package:sight_sound_walk_app/features/explore/presentation/explore_screen.dart';
import 'package:sight_sound_walk_app/features/food/presentation/food_screen.dart';
import 'package:sight_sound_walk_app/features/profile/presentation/profile_screen.dart';

final rootNavigatorKey = GlobalKey<NavigatorState>();
final shellNavigatorHomeKey = GlobalKey<NavigatorState>(debugLabel: 'shellHome');
final shellNavigatorExploreKey = GlobalKey<NavigatorState>(debugLabel: 'shellExplore');
final shellNavigatorFoodKey = GlobalKey<NavigatorState>(debugLabel: 'shellFood');
final shellNavigatorProfileKey = GlobalKey<NavigatorState>(debugLabel: 'shellProfile');

final appRouter = GoRouter(
  initialLocation: '/',
  navigatorKey: rootNavigatorKey,
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return ScaffoldWithNavBar(navigationShell: navigationShell);
      },
      branches: [
        StatefulShellBranch(
          navigatorKey: shellNavigatorHomeKey,
          routes: [
            GoRoute(
              path: '/',
              builder: (context, state) => const HomeScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: shellNavigatorExploreKey,
          routes: [
            GoRoute(
              path: '/explore',
              builder: (context, state) => const ExploreScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: shellNavigatorFoodKey,
          routes: [
            GoRoute(
              path: '/food',
              builder: (context, state) => const FoodScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: shellNavigatorProfileKey,
          routes: [
            GoRoute(
              path: '/profile',
              builder: (context, state) => const ProfileScreen(),
            ),
          ],
        ),
      ],
    ),
  ],
);
