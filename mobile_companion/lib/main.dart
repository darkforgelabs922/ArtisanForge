import 'package:flutter/material.dart';

void main() => runApp(const ArtisanForgeApp());

class ArtisanForgeApp extends StatelessWidget {
  const ArtisanForgeApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ArtisanForge Companion',
      theme: ThemeData.dark().copyWith(
        primaryColor: const Color(0xFFF59E0B),
        scaffoldBackgroundColor: const Color(0xFF020617),
      ),
      home: const Scaffold(
        body: Center(child: Text("ArtisanForge Mobile & Desktop Companion Client", style: TextStyle(color: Colors.amber))),
      ),
    );
  }
}
