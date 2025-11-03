import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const dangerColor = useThemeColor({}, 'danger');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  const inventoryData = [
    { id: 1, name: 'Wireless Headphones', stock: 5, threshold: 10 },
    { id: 2, name: 'Smartphone Case', stock: 15, threshold: 20 },
    { id: 3, name: 'Bluetooth Speaker', stock: 3, threshold: 5 },
  ];

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Low Stock Alert",
      message: "Product 'Wireless Headphones' is below threshold (5 remaining)",
      time: "2 hours ago",
      type: "warning"
    },
    {
      id: 2,
      title: "New Sale",
      message: "5 units of 'Smartphone Case' sold",
      time: "5 hours ago",
      type: "success"
    }
  ]);

  const checkLowStockItems = () => {
    // In a real app, this would check actual inventory data
    const lowStockItems = inventoryData.filter(item => item.stock <= item.threshold);
    
    if (lowStockItems.length > 0) {
      const newNotification = {
        id: Date.now(),
        title: "Low Stock Alert",
        message: `${lowStockItems.length} item(s) are below threshold`,
        time: "Just now",
        type: "warning"
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    }
    
    // Check for critical stock (0 items left)
    const criticalStockItems = inventoryData.filter(item => item.stock === 0);
    
    if (criticalStockItems.length > 0) {
      const criticalNotification = {
        id: Date.now() + 1, // Ensure unique ID
        title: "Critical Stock Alert",
        message: `${criticalStockItems.length} item(s) are out of stock!`,
        time: "Just now",
        type: "error"
      };
      
      setNotifications(prev => [criticalNotification, ...prev]);
    }
  };

  const demandData = [
    { month: 'Jan', stock: 120, demand: 50 },
    { month: 'Feb', stock: 110, demand: 50 },
    { month: 'Mar', stock: 95, demand: 50 },
    { month: 'Apr', stock: 83, demand: 50 },
    { month: 'May', stock: 70, demand: 45 },
    { month: 'Jun', stock: 60, demand: 30 },
    { month: 'Jul', stock: 20, demand: 20 },
  ];
  const maxValue = Math.max(...demandData.map(d => Math.max(d.stock, d.demand)), 100);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      // In a real app, you would fetch new data here
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            Dashboard
          </ThemedText>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => router.push('/notifications')}
            >
              <MaterialIcons name="notifications" size={24} color={textColor} />
              {notifications.length > 0 && (
                <View style={styles.notificationBadge}>
                  <ThemedText style={styles.notificationBadgeText}>
                    {notifications.length}
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Stock Overview Cards */}
        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { backgroundColor: cardBackgroundColor, borderColor }]}>
            <View style={styles.statHeader}>
              <MaterialIcons name="inventory" size={24} color={primaryColor} />
              <ThemedText type="subtitle" style={[styles.statTitle, { color: textColor }]}>Total Items</ThemedText>
            </View> 
            <ThemedText style={[styles.statValue, { color: textColor }]}>125</ThemedText>
            <ThemedText style={[styles.statDescription, { color: textSecondaryColor }]}>Motorcycle parts inventory</ThemedText>
            <View style={[styles.trendIndicator, { backgroundColor: successColor + '20' }]}>
              <MaterialIcons name="trending-up" size={16} color={successColor} />
              <ThemedText style={[styles.trendText, { color: successColor }]}>5% increase</ThemedText>
            </View>
          </Card>
          
          <Card style={[styles.statCard, { backgroundColor: cardBackgroundColor, borderColor }]}>
            <View style={styles.statHeader}>
              <MaterialIcons name="warning" size={24} color={warningColor} />
              <ThemedText type="subtitle" style={[styles.statTitle, { color: textColor }]}>Low-Stock Alerts</ThemedText>
            </View>
            <ThemedText style={[styles.statValue, { color: textColor }]}>3</ThemedText>
            <ThemedText style={[styles.statDescription, { color: textSecondaryColor }]}>Items below threshold</ThemedText>
            <View style={[styles.trendIndicator, { backgroundColor: warningColor + '20' }]}>
              <MaterialIcons name="trending-down" size={16} color={warningColor} />
              <ThemedText style={[styles.trendText, { color: warningColor }]}>2 more than last week</ThemedText>
            </View>
          </Card>
        </View>

        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { backgroundColor: cardBackgroundColor, borderColor }]}>
            <View style={styles.statHeader}>
              <MaterialIcons name="error" size={24} color={dangerColor} />
              <ThemedText type="subtitle" style={[styles.statTitle, { color: textColor }]}>Critical Items</ThemedText>
            </View>
            <ThemedText style={[styles.statValue, { color: textColor }]}>1</ThemedText>
            <ThemedText style={[styles.statDescription, { color: textSecondaryColor }]}>Urgent reorder needed</ThemedText>
            <View style={[styles.trendIndicator, { backgroundColor: dangerColor + '20' }]}>
              <MaterialIcons name="notification-important" size={16} color={dangerColor} />
              <ThemedText style={[styles.trendText, { color: dangerColor }]}>Immediate action required</ThemedText>
            </View>
          </Card>
          
          <Card style={[styles.statCard, { backgroundColor: cardBackgroundColor, borderColor }]}>
            <View style={styles.statHeader}>
              <MaterialIcons name="business" size={24} color={successColor} />
              <ThemedText type="subtitle" style={[styles.statTitle, { color: textColor }]}>Suppliers</ThemedText>
            </View>
            <ThemedText style={[styles.statValue, { color: textColor }]}>5</ThemedText>
            <ThemedText style={[styles.statDescription, { color: textSecondaryColor }]}>Active partnerships</ThemedText>
            <View style={[styles.trendIndicator, { backgroundColor: successColor + '20' }]}>
              <MaterialIcons name="group-add" size={16} color={successColor} />
              <ThemedText style={[styles.trendText, { color: successColor }]}>1 new this month</ThemedText>
            </View>
          </Card>
        </View>

        {/* AI-Powered Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>AI-Powered Alerts</ThemedText>
            <TouchableOpacity>
              <ThemedText style={[styles.viewAll, { color: primaryColor }]}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.alertCardDanger, { backgroundColor: cardBackgroundColor, borderLeftColor: dangerColor }]}>
            <View style={[styles.alertBadgeDanger, { backgroundColor: dangerColor }]} />
            <View style={{ flex: 1, gap: 4 }}>
              <ThemedText style={[styles.alertTitleDanger, { color: dangerColor }]}>Motorcycle Batteries</ThemedText>
              <ThemedText style={[styles.alertMeta, { color: textSecondaryColor }]}>BAT-YTX-001 · 92% confidence</ThemedText>
              <ThemedText style={[styles.alertMessageDanger, { color: dangerColor }]}>Predicted to run out in 7 days</ThemedText>
              <View style={styles.alertStats}>
                <View style={styles.statItem}>
                  <MaterialIcons name="inventory" size={16} color={textSecondaryColor} />
                  <ThemedText style={[styles.statText, { color: textSecondaryColor }]}>45 units</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="flag" size={16} color={textSecondaryColor} />
                  <ThemedText style={[styles.statText, { color: textSecondaryColor }]}>50 threshold</ThemedText>
                </View>
              </View>
            </View>
            <TouchableOpacity style={[styles.btn, styles.btnDanger, { backgroundColor: dangerColor }]}>
              <ThemedText style={styles.btnTextStrong}>REORDER</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={[styles.alertCardWarn, { backgroundColor: cardBackgroundColor, borderLeftColor: warningColor }]}>
            <View style={[styles.alertBadgeWarn, { backgroundColor: warningColor }]} />
            <View style={{ flex: 1, gap: 4 }}>
              <ThemedText style={[styles.alertTitleWarn, { color: warningColor }]}>Engine Oil (10W-40)</ThemedText>
              <ThemedText style={[styles.alertMeta, { color: textSecondaryColor }]}>OIL-10W40-002 · 85% confidence</ThemedText>
              <ThemedText style={[styles.alertMessageWarn, { color: warningColor }]}>Order placed - expected December 22, 2025</ThemedText>
              <View style={styles.alertStats}>
                <View style={styles.statItem}>
                  <MaterialIcons name="inventory" size={16} color={textSecondaryColor} />
                  <ThemedText style={[styles.statText, { color: textSecondaryColor }]}>32 units</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="flag" size={16} color={textSecondaryColor} />
                  <ThemedText style={[styles.statText, { color: textSecondaryColor }]}>30 threshold</ThemedText>
                </View>
              </View>
            </View>
            <TouchableOpacity style={[styles.btn, styles.btnWarn, { backgroundColor: warningColor }]}>
              <ThemedText style={styles.btnTextStrongDark}>VIEW</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demand Forecast */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>Demand Forecast</ThemedText>
            <TouchableOpacity>
              <ThemedText style={[styles.viewAll, { color: primaryColor }]}>View Report</ThemedText>
            </TouchableOpacity>
          </View>
          
          <Card style={[styles.chartCard, { backgroundColor: cardBackgroundColor, borderColor }]}>
            <View style={styles.chartHeader}>
              <ThemedText style={[styles.chartTitle, { color: textColor }]}>Stock vs Demand (Last 7 Months)</ThemedText>
              <View style={styles.chartActions}>
                <TouchableOpacity style={[styles.chartActionBtn, { backgroundColor: primaryColor + '20' }]}>
                  <MaterialIcons name="download" size={16} color={primaryColor} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.chartBox}>
              <View style={styles.chartLabelsContainer}>
                {demandData.map((d, idx) => (
                  <ThemedText 
                    key={idx} 
                    style={[styles.chartLabel, { color: textSecondaryColor }]}
                  >
                    {d.month}
                  </ThemedText>
                ))}
              </View>
              <View style={styles.chartBarsContainer}>
                {demandData.map((d, idx) => (
                  <View
                    key={idx}
                    style={styles.chartBarWrapper}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${(d.stock / maxValue) * 100}%`,
                          backgroundColor: primaryColor,
                          marginBottom: 6,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${(d.demand / maxValue) * 100}%`,
                          backgroundColor: '#6c63ff',
                        },
                      ]}
                    />
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: primaryColor }]} />
                <ThemedText style={[styles.legendText, { color: textColor }]}>Current Stock</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: '#6c63ff' }]} />
                <ThemedText style={[styles.legendText, { color: textColor }]}>Predicted Demand</ThemedText>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  notificationButton: {
    position: 'relative',
  },
  
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 4,
  },
  statDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  alertCardDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertCardWarn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertBadgeDanger: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  alertBadgeWarn: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  alertTitleDanger: {
    fontWeight: '700',
    fontSize: 16,
  },
  alertTitleWarn: {
    fontWeight: '700',
    fontSize: 16,
  },
  alertMeta: {
    fontSize: 12,
  },
  alertMessageDanger: {
    fontWeight: '700',
    fontSize: 14,
  },
  alertMessageWarn: {
    fontWeight: '700',
    fontSize: 14,
  },
  alertStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 12,
  },
  btnDanger: {
    backgroundColor: '#d32f2f',
  },
  btnWarn: {
    backgroundColor: '#FFD166',
  },
  btnTextStrong: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  btnTextStrongDark: {
    color: '#333333',
    fontWeight: '800',
    fontSize: 12,
  },
  chartCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chartActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartBox: {
    marginBottom: 12,
    paddingVertical: 16,
  },
  chartBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
  },
  chartBarWrapper: {
    alignItems: 'center',
    width: 36,
    flexDirection: 'column-reverse',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: 16,
    borderRadius: 4,
  },
  chartLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    width: 36,
    textAlign: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontWeight: '600',
  },
});
