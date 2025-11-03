import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NotificationCenter } from '@/components/ui/notification-center';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();
  
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const dangerColor = useThemeColor({}, 'danger');

  // Sample notifications data - in a real app this would come from a global state or API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Low Stock Alert",
      message: "Motorcycle Batteries ' is below threshold (5 remaining)",
      time: "2 hours ago",
      type: "warning"
    },
    {
      id: 2,
      title: "New Sale",
      message: "5 units of 'Engine Oil' sold",
      time: "5 hours ago",
      type: "success"
    },
    {
      id: 3,
      title: "Critical Stock Level",
      message: "Motorcycle Batteries running critically low (3 remaining)",
      time: "1 day ago",
      type: "error"
    },
    {
      id: 4,
      title: "New Supplier Added",
      message: "King Motors Osmena has been added to your supplier list",
      time: "2 days ago",
      type: "success"
    },
    {
      id: 5,
      title: "Inventory Update",
      message: "Monthly stocktake completed successfully",
      time: "1 week ago",
      type: "info"
    }
  ]);

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>
          Notifications
        </ThemedText>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>
      
      <NotificationCenter 
        notifications={notifications} 
        onClearAll={handleClearAll} 
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50, // Account for status bar
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});