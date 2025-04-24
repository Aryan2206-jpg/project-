import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, List, Chip, Searchbar, ProgressBar, Divider } from 'react-native-paper';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

// Types
interface Bin {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'empty' | 'partial' | 'full';
  lastCollected: Date;
  capacity: number;
  currentLevel: number;
  type: 'general' | 'recyclable' | 'organic';
}

interface Route {
  id: string;
  driverId: string;
  bins: string[];
  status: 'pending' | 'in-progress' | 'completed';
  date: Date;
  estimatedDuration: number;
  actualDuration?: number;
}

interface Driver {
  id: string;
  name: string;
  contact: string;
  currentRoute?: string;
  activeStatus: 'available' | 'on-route' | 'off-duty';
}

interface CollectionSchedule {
  id: string;
  binId: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  preferredTimeWindow: {
    start: string;
    end: string;
  };
  priority: 'low' | 'medium' | 'high';
}

// Mock Data
const mockBins: Bin[] = [
  {
    id: '1',
    location: {
      latitude: 51.5074,
      longitude: -0.1278,
      address: '123 Main St, London'
    },
    status: 'full',
    lastCollected: new Date('2024-04-23'),
    capacity: 100,
    currentLevel: 90,
    type: 'general'
  }
];

const mockRoutes: Route[] = [
  {
    id: '1',
    driverId: 'D1',
    bins: ['1', '2', '3'],
    status: 'pending',
    date: new Date('2024-04-24'),
    estimatedDuration: 120,
  },
  {
    id: '2',
    driverId: 'D2',
    bins: ['4', '5', '6'],
    status: 'in-progress',
    date: new Date('2024-04-24'),
    estimatedDuration: 90,
  }
];

const mockDrivers: Driver[] = [
  {
    id: 'D1',
    name: 'John Smith',
    contact: '+44 123 456 7890',
    activeStatus: 'available',
  },
  {
    id: 'D2',
    name: 'Jane Doe',
    contact: '+44 098 765 4321',
    activeStatus: 'on-route',
  }
];

const mockSchedules: CollectionSchedule[] = [
  {
    id: '1',
    binId: '1',
    frequency: 'weekly',
    preferredTimeWindow: {
      start: '09:00',
      end: '12:00',
    },
    priority: 'high',
  },
  {
    id: '2',
    binId: '2',
    frequency: 'bi-weekly',
    preferredTimeWindow: {
      start: '13:00',
      end: '16:00',
    },
    priority: 'medium',
  }
];

// Navigation Types
type RootStackParamList = {
  Dashboard: undefined;
  BinMap: undefined;
  RouteManagement: undefined;
  Schedule: undefined;
  BinDetails: { binId: string };
};

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;
type BinMapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BinMap'>;
type BinDetailsRouteProp = RouteProp<RootStackParamList, 'BinDetails'>;

// Dashboard Screen
const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Active Bins</Title>
            <Paragraph>150</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Bins Requiring Collection</Title>
            <Paragraph>23</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Active Routes</Title>
            <Paragraph>5</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('BinMap')}
        >
          View Bin Map
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('RouteManagement')}
        >
          Manage Routes
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Schedule')}
        >
          Collection Schedule
        </Button>
      </View>
    </ScrollView>
  );
};

// BinMap Screen
const BinMapScreen = () => {
  const navigation = useNavigation<BinMapScreenNavigationProp>();
  const [selectedBin, setSelectedBin] = React.useState<Bin | null>(null);

  const getBinMarkerColor = (status: Bin['status']) => {
    switch (status) {
      case 'empty':
        return 'green';
      case 'partial':
        return 'yellow';
      case 'full':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 51.5074,
          longitude: -0.1278,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {mockBins.map((bin) => (
          <Marker
            key={bin.id}
            coordinate={{
              latitude: bin.location.latitude,
              longitude: bin.location.longitude,
            }}
            pinColor={getBinMarkerColor(bin.status)}
            onPress={() => setSelectedBin(bin)}
          >
            <Callout
              onPress={() => navigation.navigate('BinDetails', { binId: bin.id })}
            >
              <Card>
                <Card.Content>
                  <Title>Bin #{bin.id}</Title>
                  <Paragraph>Status: {bin.status}</Paragraph>
                  <Paragraph>Type: {bin.type}</Paragraph>
                  <Paragraph>Fill Level: {bin.currentLevel}%</Paragraph>
                  <Paragraph>Tap for details</Paragraph>
                </Card.Content>
              </Card>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

// BinDetails Screen
interface BinDetailsProps {
  route: BinDetailsRouteProp;
}

const BinDetailsScreen: React.FC<BinDetailsProps> = ({ route }) => {
  const { binId } = route.params;
  const bin = mockBins[0]; // In a real app, fetch bin details using binId

  const getFillLevelColor = (level: number) => {
    if (level >= 80) return '#FF5252';
    if (level >= 50) return '#FFB300';
    return '#4CAF50';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Bin Status</Title>
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={bin.currentLevel / 100}
              color={getFillLevelColor(bin.currentLevel)}
              style={styles.progressBar}
            />
            <Paragraph style={styles.progressText}>
              {bin.currentLevel}% Full
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Location Details</Title>
          <Paragraph>Address: {bin.location.address}</Paragraph>
          <Paragraph>Latitude: {bin.location.latitude}</Paragraph>
          <Paragraph>Longitude: {bin.location.longitude}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Collection History</Title>
          <Paragraph>Last Collected: {formatDate(bin.lastCollected)}</Paragraph>
          <Paragraph>Bin Type: {bin.type}</Paragraph>
          <Paragraph>Capacity: {bin.capacity} liters</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => {
            console.log('Schedule collection for bin:', binId);
          }}
        >
          Schedule Collection
        </Button>

        <Button
          mode="outlined"
          style={styles.button}
          onPress={() => {
            console.log('Report issue for bin:', binId);
          }}
        >
          Report Issue
        </Button>
      </View>
    </ScrollView>
  );
};

// Route Management Screen
const RouteManagementScreen = () => {
  const [selectedRoute, setSelectedRoute] = React.useState<Route | null>(null);

  const getStatusColor = (status: Route['status']) => {
    switch (status) {
      case 'pending':
        return '#FFB300';
      case 'in-progress':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const getDriverName = (driverId: string) => {
    const driver = mockDrivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Route Summary</Title>
          <View style={styles.summaryStats}>
            <Paragraph>Active Routes: {mockRoutes.length}</Paragraph>
            <Paragraph>Available Drivers: {
              mockDrivers.filter(d => d.activeStatus === 'available').length
            }</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.routesList}>
        <Title style={styles.sectionTitle}>Active Routes</Title>
        {mockRoutes.map(route => (
          <Card
            key={route.id}
            style={[styles.routeCard, selectedRoute?.id === route.id && styles.selectedCard]}
            onPress={() => setSelectedRoute(route)}
          >
            <Card.Content>
              <View style={styles.routeHeader}>
                <Title>Route #{route.id}</Title>
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor(route.status) },
                  ]}
                />
              </View>
              <Divider style={styles.divider} />
              <List.Item
                title={getDriverName(route.driverId)}
                description="Assigned Driver"
                left={props => <List.Icon {...props} icon="account" />}
              />
              <List.Item
                title={formatDate(route.date)}
                description="Collection Date"
                left={props => <List.Icon {...props} icon="calendar" />}
              />
              <List.Item
                title={`${route.bins.length} Bins`}
                description="Collection Points"
                left={props => <List.Icon {...props} icon="delete-empty" />}
              />
              <List.Item
                title={`${route.estimatedDuration} minutes`}
                description="Estimated Duration"
                left={props => <List.Icon {...props} icon="clock-outline" />}
              />
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => console.log('View route details:', route.id)}>
                View Details
              </Button>
              <Button mode="outlined" onPress={() => console.log('Edit route:', route.id)}>
                Edit Route
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>

      <Button
        mode="contained"
        style={styles.addButton}
        icon="plus"
        onPress={() => console.log('Create new route')}
      >
        Create New Route
      </Button>
    </ScrollView>
  );
};

// Schedule Screen
const ScheduleScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFrequency, setSelectedFrequency] = React.useState<string | null>(null);

  const frequencies = ['daily', 'weekly', 'bi-weekly', 'monthly'];

  const getPriorityColor = (priority: CollectionSchedule['priority']) => {
    switch (priority) {
      case 'high':
        return '#FF5252';
      case 'medium':
        return '#FFB300';
      case 'low':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const filteredSchedules = mockSchedules.filter(schedule => {
    const matchesSearch = schedule.binId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFrequency = !selectedFrequency || schedule.frequency === selectedFrequency;
    return matchesSearch && matchesFrequency;
  });

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by bin ID"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView horizontal style={styles.filterContainer}>
        {frequencies.map(frequency => (
          <Chip
            key={frequency}
            selected={selectedFrequency === frequency}
            onPress={() => setSelectedFrequency(
              selectedFrequency === frequency ? null : frequency
            )}
            style={styles.filterChip}
          >
            {frequency}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.scheduleList}>
        {filteredSchedules.map(schedule => (
          <Card key={schedule.id} style={styles.scheduleCard}>
            <Card.Content>
              <View style={styles.scheduleHeader}>
                <Title>Bin #{schedule.binId}</Title>
                <Chip
                  style={[
                    styles.priorityChip,
                    { backgroundColor: getPriorityColor(schedule.priority) },
                  ]}
                >
                  {schedule.priority}
                </Chip>
              </View>

              <List.Item
                title={`Frequency: ${schedule.frequency}`}
                left={props => <List.Icon {...props} icon="calendar-sync" />}
              />
              <List.Item
                title={`Time Window: ${schedule.preferredTimeWindow.start} - ${schedule.preferredTimeWindow.end}`}
                left={props => <List.Icon {...props} icon="clock-outline" />}
              />
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => console.log('Edit schedule:', schedule.id)}>
                Edit Schedule
              </Button>
              <Button mode="outlined" onPress={() => console.log('Delete schedule:', schedule.id)}>
                Delete
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <Button
        mode="contained"
        icon="plus"
        style={styles.addButton}
        onPress={() => console.log('Create new schedule')}
      >
        Add New Schedule
      </Button>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  statsContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '48%',
    marginBottom: 16,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  map: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 20,
    borderRadius: 10,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  routesList: {
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  routeCard: {
    marginBottom: 16,
  },
  selectedCard: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  divider: {
    marginVertical: 8,
  },
  addButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  searchBar: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  scheduleList: {
    flex: 1,
  },
  scheduleCard: {
    marginBottom: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityChip: {
    height: 24,
  },
});

// Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

// Main App
const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ title: 'Waste Management Dashboard' }}
          />
          <Stack.Screen 
            name="BinMap" 
            component={BinMapScreen}
            options={{ title: 'Bin Locations' }}
          />
          <Stack.Screen 
            name="RouteManagement" 
            component={RouteManagementScreen}
            options={{ title: 'Route Management' }}
          />
          <Stack.Screen 
            name="Schedule" 
            component={ScheduleScreen}
            options={{ title: 'Collection Schedule' }}
          />
          <Stack.Screen 
            name="BinDetails" 
            component={BinDetailsScreen}
            options={{ title: 'Bin Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App; 