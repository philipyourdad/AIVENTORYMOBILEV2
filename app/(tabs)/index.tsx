import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function DashboardScreen() {
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

  return (
    <ThemedView style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ThemedText type="title" style={{ color: '#000' }}>Dashboard</ThemedText>
        {/* Stock Overview Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <MaterialIcons name="inventory" size={20} color="#2E3A8C" />
              <ThemedText type="subtitle" style={{ color: '#2E3A8C' }}>Total Items</ThemedText>
            </View> 
            <ThemedText style={styles.statValue}>125</ThemedText>
            <ThemedText style={styles.statDescription}>Motorcycle parts inventory</ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <MaterialIcons name="warning" size={20} color="#B58900" />
              <ThemedText type="subtitle" style={{ color: '#2E3A8C' }}>Low-Stock Alerts</ThemedText>
            </View>
            <ThemedText style={styles.statValue}>3</ThemedText>
            <ThemedText style={styles.statDescription}>Items below threshold</ThemedText>
          </Card>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <MaterialIcons name="error" size={20} color="#d32f2f" />
              <ThemedText type="subtitle" style={{ color: '#2E3A8C' }}>Critical Items</ThemedText>
            </View>
            <ThemedText style={styles.statValue}>1</ThemedText>
            <ThemedText style={styles.statDescription}>Urgent reorder needed</ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <MaterialIcons name="business" size={20} color="#06D6A0" />
              <ThemedText type="subtitle" style={{ color: '#2E3A8C' }}>Suppliers</ThemedText>
            </View>
            <ThemedText style={styles.statValue}>5</ThemedText>
            <ThemedText style={styles.statDescription}>Active partnerships</ThemedText>
          </Card>
        </View>

        {/* AI-Powered Alerts */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>AI-Powered Alerts</ThemedText>
          <View style={styles.alertCardDanger}>
            <View style={styles.alertBadgeDanger} />
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText style={styles.alertTitleDanger}>Motorcycle Batteries</ThemedText>
              <ThemedText style={styles.alertMeta}>BAT-YTX-001 · 92% confidence</ThemedText>
              <ThemedText style={styles.alertMessageDanger}>Predicted to run out in 7 days</ThemedText>
              <ThemedText style={styles.alertMeta}>Stock: 45 | Threshold: 50</ThemedText>
            </View>
            <TouchableOpacity style={[styles.btn, styles.btnDanger]}>
              <ThemedText style={styles.btnTextStrong}>REORDER</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.alertCardWarn}>
            <View style={styles.alertBadgeWarn} />
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText style={styles.alertTitleWarn}>Engine Oil (10W-40)</ThemedText>
              <ThemedText style={styles.alertMeta}>OIL-10W40-002 · 85% confidence</ThemedText>
              <ThemedText style={styles.alertMessageWarn}>Order placed - expected December 22, 2025</ThemedText>
              <ThemedText style={styles.alertMeta}>Stock: 32 | Threshold: 30</ThemedText>
            </View>
            <TouchableOpacity style={[styles.btn, styles.btnWarn]}>
              <ThemedText style={styles.btnTextStrongDark}>VIEW</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demand Forecast */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Demand Forecast</ThemedText>
          <Card style={styles.chartCard}>
            <View style={styles.chartBox}>
              {demandData.map((d, idx) => (
                <View key={idx} style={styles.chartBarWrapper}>
                  <View style={styles.chartBarsContainer}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${(d.stock / maxValue) * 100}%`,
                          backgroundColor: '#2E3A8C',
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
                  <ThemedText style={styles.chartLabel}>{d.month}</ThemedText>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: '#2E3A8C' }]} />
                <ThemedText style={styles.legendText}>Current Stock</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: '#6c63ff' }]} />
                <ThemedText style={styles.legendText}>Predicted Demand</ThemedText>
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
    backgroundColor: '#f0f2f5',
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 2,
    color: '#1a1a1a',
  },
  statDescription: {
    fontSize: 14,
    color: '#666666',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#1a1a1a',
  },
  alertCardDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertCardWarn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#B58900',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertBadgeDanger: {
    width: 6,
    alignSelf: 'stretch',
    backgroundColor: '#d32f2f',
    borderRadius: 4,
    marginRight: 12,
  },
  alertBadgeWarn: {
    width: 6,
    alignSelf: 'stretch',
    backgroundColor: '#B58900',
    borderRadius: 4,
    marginRight: 12,
  },
  alertTitleDanger: {
    color: '#d32f2f',
    fontWeight: '700',
    fontSize: 16,
  },
  alertTitleWarn: {
    color: '#B58900',
    fontWeight: '700',
    fontSize: 16,
  },
  alertMeta: {
    color: '#666666',
    fontSize: 12,
  },
  alertMessageDanger: {
    color: '#d32f2f',
    fontWeight: '700',
  },
  alertMessageWarn: {
    color: '#B58900',
    fontWeight: '700',
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
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
  },
  btnTextStrongDark: {
    color: '#333333',
    fontWeight: '800',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 16,
  },
  chartBarsContainer: {
    height: 120,
    flexDirection: 'column-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartBarWrapper: {
    alignItems: 'center',
    width: 36,
  },
  chartBar: {
    width: 16,
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
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
    color: '#333333',
    fontWeight: '600',
  },
});