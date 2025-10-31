import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function PredictionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get item data from params or use default
  const item = {
    name: params.name || 'AA Batteries',
    sku: params.sku || 'BAT-AA-001',
    stock: params.stock ? parseInt(params.stock as string) : 45,
    threshold: params.threshold ? parseInt(params.threshold as string) : 50,
    status: params.status || 'At Risk'
  };

  // Chart data for stock level history and prediction
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [120, 110, 105, 100, 95, 85, 80, 75, 70, 65, 55, 45],
        color: (opacity = 1) => `rgba(46, 58, 140, ${opacity})`,
        strokeWidth: 2
      },
      {
        data: [null, null, null, null, null, null, null, null, null, null, 55, 45, 35, 25, 15, 5, 0],
        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        strokeWidth: 2,
        dashedLine: [5, 5]
      },
      {
        data: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
        color: (opacity = 1) => `rgba(6, 214, 160, ${opacity})`,
        strokeWidth: 1,
        dashedLine: [3, 3]
      }
    ],
    legend: ['Historical Stock', 'AI Prediction', 'Reorder Threshold']
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 58, 140, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#2E3A8C'
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/inventory')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#2E3A8C" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>AI Prediction</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Item Details */}
        <Card style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <ThemedText type="defaultSemiBold" style={styles.itemName}>{item.name}</ThemedText>
            <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          
          <View style={styles.itemMeta}>
            <View style={styles.metaItem}>
              <ThemedText style={styles.metaLabel}>SKU:</ThemedText>
              <ThemedText style={styles.metaValue}>{item.sku}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <ThemedText style={styles.metaLabel}>Stock:</ThemedText>
              <ThemedText style={styles.metaValue}>{item.stock} units</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <ThemedText style={styles.metaLabel}>Threshold:</ThemedText>
              <ThemedText style={styles.metaValue}>{item.threshold} units</ThemedText>
            </View>
          </View>
        </Card>

        {/* AI Prediction Alert */}
        <Card style={[styles.predictionCard, styles.urgent]}>
          <View style={styles.predictionHeader}>
            <MaterialIcons name="warning" size={20} color="#FF6B6B" />
            <ThemedText type="subtitle" style={styles.predictionTitle}>AI Prediction Alert</ThemedText>
          </View>
          
          <View style={styles.predictionBody}>
            <ThemedText style={styles.predictionText}>
              Item predicted to run out in <Text style={styles.boldText}>7 days</Text>.
            </ThemedText>
            
            <View style={styles.predictionDetails}>
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Depletion Date:</ThemedText>
                <ThemedText style={styles.detailValue}>May 20, 2025</ThemedText>
              </View>
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Confidence:</ThemedText>
                <View style={styles.confidenceContainer}>
                  <View style={styles.confidenceBarBackground}>
                    <View style={[styles.confidenceBar, { width: '92%' }]} />
                  </View>
                  <ThemedText style={styles.detailValue}>92%</ThemedText>
                </View>
              </View>
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Suggested Qty:</ThemedText>
                <ThemedText style={styles.detailValue}>50 units</ThemedText>
              </View>
            </View>
          </View>
          
          <View style={styles.predictionActions}>
            <TouchableOpacity style={styles.primaryButton}>
              <MaterialIcons name="shopping-cart" size={16} color="#fff" />
              <ThemedText style={styles.buttonText}>Reorder</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.outlineButton}
              onPress={() => router.push({
                pathname: '/analysis',
                params: {
                  name: item.name,
                  sku: item.sku,
                  stock: item.stock.toString(),
                  threshold: item.threshold.toString(),
                  status: item.status
                }
              })}
            >
              <MaterialIcons name="insights" size={16} color="#2E3A8C" />
              <ThemedText style={styles.outlineButtonText}>Analysis</ThemedText>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Historical Data Chart */}
        <Card style={styles.chartCard}>
          <ThemedText type="subtitle" style={styles.chartTitle}>Stock Level History & Prediction</ThemedText>
          <LineChart
            data={chartData}
            width={windowWidth - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

// Helper function to get status style
function getStatusStyle(status: string) {
  switch (status) {
    case 'Good': return { backgroundColor: 'rgba(6, 214, 160, 0.1)', borderColor: '#06D6A0' };
    case 'Warning': return { backgroundColor: 'rgba(255, 209, 102, 0.1)', borderColor: '#FFD166' };
    case 'At Risk': return { backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: '#FF6B6B' };
    default: return { backgroundColor: 'rgba(108, 117, 125, 0.1)', borderColor: '#6C757D' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    flex: 1,
    color: '#1a1a1a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    color: '#1a1a1a',
    fontSize: 18,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
  },
  metaLabel: {
    color: '#666666',
    fontSize: 14,
    marginRight: 4,
    width: 80,
  },
  metaValue: {
    color: '#333333',
    fontWeight: '600',
    fontSize: 14,
  },
  predictionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    marginBottom: 16,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionTitle: {
    marginLeft: 8,
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  predictionBody: {
    marginBottom: 16,
  },
  predictionText: {
    color: '#333333',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
  },
  predictionDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#666666',
    fontSize: 14,
  },
  detailValue: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 14,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confidenceBarBackground: {
    width: 60,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  confidenceBar: {
    height: '100%',
    backgroundColor: '#2E3A8C',
    borderRadius: 3,
  },
  predictionActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E3A8C',
    paddingVertical: 12,
    borderRadius: 6,
    gap: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  outlineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2E3A8C',
    gap: 6,
  },
  outlineButtonText: {
    color: '#2E3A8C',
    fontWeight: '600',
    fontSize: 15,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 16,
  },
  chartTitle: {
    marginBottom: 16,
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
});