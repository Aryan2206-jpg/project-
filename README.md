# Waste Management Tracking Application

A mobile application designed for waste management authorities to track bin status and optimize collection schedules.

## Features

- Real-time bin status monitoring
- Collection route optimization
- Interactive map view of bins
- Analytics dashboard
- Push notifications for critical updates
- Collection schedule management
- Driver assignment system

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. iOS Setup:
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. Start the application:
   - For Android: `npm run android`
   - For iOS: `npm run ios`

## Technology Stack

- React Native
- TypeScript
- Firebase (Authentication, Firestore)
- React Navigation
- React Native Maps
- React Native Paper

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Application screens
├── navigation/     # Navigation configuration
├── services/       # API and business logic
├── utils/         # Helper functions
├── assets/        # Images, fonts, etc.
└── types/         # TypeScript type definitions
```

## Environment Setup

1. Create a Firebase project and add your configuration
2. Set up Google Maps API key
3. Configure environment variables

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 