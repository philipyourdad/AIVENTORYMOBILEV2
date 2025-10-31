import { StyleSheet, View, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useThemeColor } from '@/hooks/use-theme-color';

const DATA = [
  { id: '1', name: 'Motorcycle Batteries', sku: 'BAT-YTX-001', category: 'Battery', stock: 45, threshold: 50, status: 'At Risk' },
  { id: '2', name: 'Engine Oil (10W-40)', sku: 'OIL-10W40-002', category: 'Lubricants', stock: 32, threshold: 30, status: 'Warning' },
  { id: '3', name: 'Drive Chains', sku: 'CHN-520-003', category: 'Transmission', stock: 120, threshold: 50, status: 'Good' },
  { id: '4', name: 'Brake Pads', sku: 'BRK-PAD-004', category: 'Brakes', stock: 15, threshold: 20, status: 'At Risk' },
  { id: '5', name: 'Motorcycle Spark Plugs', sku: 'SPK-NGK-005', category: 'Electrical', stock: 65, threshold: 40, status: 'Good' },
];

export default function InventoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [inventoryData, setInventoryData] = useState(DATA);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [quantityToRemove, setQuantityToRemove] = useState('1');
  const [editForm, setEditForm] = useState({
    name: '',
    sku: '',
    category: '',
    stock: '',
    threshold: ''
  });

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const textTertiaryColor = useThemeColor({}, 'textTertiary');
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const dangerColor = useThemeColor({}, 'danger');
  const warningColor = useThemeColor({}, 'warning');

  // Handle incoming scanned item parameters
  useEffect(() => {
    // Handle adding new items
    if (params.scannedBarcode && params.itemName && params.action === 'add') {
      // Check if item with the same SKU already exists
      const existingItemIndex = inventoryData.findIndex(item => item.sku === params.scannedBarcode);
      
      if (existingItemIndex !== -1) {
        // Item exists, increase stock by 1
        const updatedData = [...inventoryData];
        const existingItem = updatedData[existingItemIndex];
        updatedData[existingItemIndex] = {
          ...existingItem,
          stock: existingItem.stock + 1
        };
        
        setInventoryData(updatedData);
        Alert.alert('Success', `Stock for ${existingItem.name} increased to ${existingItem.stock + 1}`);
      } else {
        // Item doesn't exist, create new item
        const newItem = {
          id: `${Date.now()}`, // Use timestamp for unique ID
          name: params.itemName,
          sku: params.scannedBarcode,
          category: 'Scanned Item',
          stock: 1, // Default stock value
          threshold: 10, // Default threshold value
          status: 'Good' // Default status
        };
        
        // Add to inventory
        setInventoryData(prevData => [...prevData, newItem]);
        Alert.alert('Success', `${params.itemName} has been added to inventory`);
      }
      
      // Clear params to prevent duplicate additions
      router.setParams({ scannedBarcode: undefined, itemName: undefined, action: undefined });
    }
    
    // Handle removing items
    if (params.scannedBarcode && params.quantityToRemove && params.action === 'remove') {
      // Find item with the same SKU
      const existingItemIndex = inventoryData.findIndex(item => item.sku === params.scannedBarcode);
      
      if (existingItemIndex !== -1) {
        // Item exists, update stock
        const existingItem = inventoryData[existingItemIndex];
        const quantity = parseInt(params.quantityToRemove);
        
        if (quantity > existingItem.stock) {
          Alert.alert('Error', `Cannot remove more than available stock (${existingItem.stock})`);
        } else {
          // Update stock
          const updatedData = [...inventoryData];
          updatedData[existingItemIndex] = {
            ...existingItem,
            stock: existingItem.stock - quantity
          };
          
          setInventoryData(updatedData);
          
          // Generate invoice for removed items
          const invoice = {
            id: `INV-${Date.now()}`,
            date: new Date().toLocaleDateString(),
            customer: 'Walk-in Customer',
            items: [{
              name: existingItem.name,
              quantity: quantity,
              price: 0 // Price would need to be stored in the item data
            }],
            subtotal: 0,
            tax: 0,
            total: 0,
            status: 'Paid',
            paymentMethod: 'Cash'
          };
          
          // Store invoice (in a real app, this would be stored in a database)
          // For now, we'll just show it in an alert
          Alert.alert(
            'Invoice Generated', 
            `Invoice ID: ${invoice.id}\n` +
            `Date: ${invoice.date}\n` +
            `Item: ${existingItem.name}\n` +
            `Quantity: ${quantity}\n` +
            `Total: $${invoice.total.toFixed(2)}\n` +
            `Status: ${invoice.status}`,
            [{ text: 'OK' }]
          );
          
          Alert.alert('Success', `${quantity} unit(s) removed from ${existingItem.name}. New stock: ${updatedData[existingItemIndex].stock}`);
        }
      } else {
        // Item doesn't exist
        Alert.alert('Not Found', 'Item with this barcode does not exist in inventory');
      }
      
      // Clear params
      router.setParams({ scannedBarcode: undefined, quantityToRemove: undefined, action: undefined });
    }
  }, [params.scannedBarcode, params.itemName, params.quantityToRemove, params.action]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return successColor;
      case 'Warning': return warningColor;
      case 'At Risk': return dangerColor;
      default: return '#6C757D';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Good': return `rgba(${hexToRgb(successColor).r}, ${hexToRgb(successColor).g}, ${hexToRgb(successColor).b}, 0.1)`;
      case 'Warning': return `rgba(${hexToRgb(warningColor).r}, ${hexToRgb(warningColor).g}, ${hexToRgb(warningColor).b}, 0.1)`;
      case 'At Risk': return `rgba(${hexToRgb(dangerColor).r}, ${hexToRgb(dangerColor).g}, ${hexToRgb(dangerColor).b}, 0.1)`;
      default: return 'rgba(108, 117, 125, 0.1)';
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditForm({
      name: item.name,
      sku: item.sku,
      category: item.category,
      stock: item.stock.toString(),
      threshold: item.threshold.toString()
    });
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedItem(null);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalVisible(false);
    setSelectedItem(null);
    setQuantityToRemove('1');
  };

  const handleEditSave = () => {
    if (!editForm.name || !editForm.sku || !editForm.category || !editForm.stock || !editForm.threshold) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setInventoryData(inventoryData.map(item => 
      item.id === selectedItem.id 
        ? { 
            ...item, 
            name: editForm.name,
            sku: editForm.sku,
            category: editForm.category,
            stock: parseInt(editForm.stock),
            threshold: parseInt(editForm.threshold)
          } 
        : item
    ));
    
    closeEditModal();
  };

  const handleRemoveSave = () => {
    const quantity = parseInt(quantityToRemove);
    
    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }
    
    if (quantity > selectedItem.stock) {
      Alert.alert('Error', `Cannot remove more than available stock (${selectedItem.stock})`);
      return;
    }
    
    // Update stock
    const updatedData = [...inventoryData];
    const itemIndex = updatedData.findIndex(item => item.id === selectedItem.id);
    
    if (itemIndex !== -1) {
      updatedData[itemIndex] = {
        ...updatedData[itemIndex],
        stock: updatedData[itemIndex].stock - quantity
      };
      
      setInventoryData(updatedData);
      
      // Generate invoice for removed items
      const invoice = {
        id: `INV-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        customer: 'Walk-in Customer',
        items: [{
          name: selectedItem.name,
          quantity: quantity,
          price: 0 // Price would need to be stored in the item data
        }],
        subtotal: 0,
        tax: 0,
        total: 0,
        status: 'Paid',
        paymentMethod: 'Cash'
      };
      
      // Store invoice (in a real app, this would be stored in a database)
      // For now, we'll just show it in an alert
      Alert.alert(
        'Invoice Generated', 
        `Invoice ID: ${invoice.id}\n` +
        `Date: ${invoice.date}\n` +
        `Item: ${selectedItem.name}\n` +
        `Quantity: ${quantity}\n` +
        `Total: $${invoice.total.toFixed(2)}\n` +
        `Status: ${invoice.status}`,
        [{ text: 'OK' }]
      );
      
      Alert.alert('Success', `${quantity} unit(s) removed from ${selectedItem.name}. New stock: ${updatedData[itemIndex].stock}`);
    }
    
    closeRemoveModal();
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setInventoryData(inventoryData.filter(i => i.id !== item.id));
          }
        }
      ]
    );
  };

  const handleCardPress = (item) => {
    router.push({
      pathname: '/prediction',
      params: {
        name: item.name,
        sku: item.sku,
        stock: item.stock.toString(),
        threshold: item.threshold.toString(),
        status: item.status
      }
    });
  };

  return (
    <ThemedView style={styles.container}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>Inventory</ThemedText>
      <FlatList
        data={inventoryData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, paddingTop: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: cardBackgroundColor }]}
            onPress={() => handleCardPress(item)}
          >
            <View style={styles.itemHeader}>
              <ThemedText type="defaultSemiBold" style={[styles.itemName, { color: textColor }]}>{item.name}</ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status), borderColor: getStatusColor(item.status) }]}>
                <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</ThemedText>
              </View>
            </View>
            
            <View style={styles.metaRow}>
              <ThemedText style={[styles.skuText, { color: textSecondaryColor }]}>{item.sku}</ThemedText>
              <View style={styles.inlineRow}>
                <MaterialIcons name="category" size={16} color={textTertiaryColor} />
                <ThemedText style={[styles.metaText, { color: textTertiaryColor }]}> {item.category}</ThemedText>
              </View>
            </View>
            
            <View style={styles.stockRow}>
              <View style={styles.stockItem}>
                <MaterialIcons name="inventory" size={16} color={primaryColor} />
                <ThemedText style={[styles.stockText, { color: textSecondaryColor }]}> {item.stock}</ThemedText>
              </View>
              <View style={styles.stockItem}>
                <MaterialIcons name="flag" size={16} color={textTertiaryColor} />
                <ThemedText style={[styles.stockText, { color: textSecondaryColor }]}> {item.threshold}</ThemedText>
              </View>
            </View>
            
            <View style={[styles.actionRow, { borderTopColor: borderColor }]}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: cardBackgroundColor }]} onPress={() => openEditModal(item)}>
                <MaterialIcons name="edit" size={16} color={primaryColor} />
                <ThemedText style={[styles.actionText, { color: primaryColor }]}>Edit</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: cardBackgroundColor }]} onPress={() => {
                setSelectedItem(item);
                setQuantityToRemove('1');
                setIsRemoveModalVisible(true);
              }}>
                <MaterialIcons name="remove-shopping-cart" size={16} color={dangerColor} />
                <ThemedText style={[styles.actionText, { color: dangerColor }]}>Remove</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: cardBackgroundColor }]} onPress={() => handleDelete(item)}>
                <MaterialIcons name="delete" size={16} color={dangerColor} />
                <ThemedText style={[styles.actionText, { color: dangerColor }]}>Delete</ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

        )}
      />
      
      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={closeEditModal}>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: cardBackgroundColor }]}>
            <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
              <ThemedText type="title" style={[styles.modalTitle, { color: textColor }]}>Edit Item</ThemedText>
              <TouchableOpacity onPress={closeEditModal}>
                <MaterialIcons name="close" size={24} color={textTertiaryColor} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Item Name</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: cardBackgroundColor, borderColor: borderColor, color: textColor }]}
                value={editForm.name}
                onChangeText={(text) => setEditForm({...editForm, name: text})}
                placeholder="Enter item name"
                placeholderTextColor={textTertiaryColor}
              />
            </View>
            
            <View style={styles.formGroup}>
              <ThemedText style={[styles.label, { color: textSecondaryColor }]}>SKU</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: cardBackgroundColor, borderColor: borderColor, color: textColor }]}
                value={editForm.sku}
                onChangeText={(text) => setEditForm({...editForm, sku: text})}
                placeholder="Enter SKU"
                placeholderTextColor={textTertiaryColor}
              />
            </View>
            
            <View style={styles.formGroup}>
              <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Category</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: cardBackgroundColor, borderColor: borderColor, color: textColor }]}
                value={editForm.category}
                onChangeText={(text) => setEditForm({...editForm, category: text})}
                placeholder="Enter category"
                placeholderTextColor={textTertiaryColor}
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={styles.halfFormGroup}>
                <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Stock</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: cardBackgroundColor, borderColor: borderColor, color: textColor }]}
                  value={editForm.stock}
                  onChangeText={(text) => setEditForm({...editForm, stock: text})}
                  placeholder="Enter stock"
                  placeholderTextColor={textTertiaryColor}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.halfFormGroup}>
                <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Threshold</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: cardBackgroundColor, borderColor: borderColor, color: textColor }]}
                  value={editForm.threshold}
                  onChangeText={(text) => setEditForm({...editForm, threshold: text})}
                  placeholder="Enter threshold"
                  placeholderTextColor={textTertiaryColor}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.cancelButton, { backgroundColor: borderColor }]} 
                onPress={closeEditModal}
              >
                <ThemedText style={[styles.cancelButtonText, { color: textSecondaryColor }]}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: primaryColor }]} 
                onPress={handleEditSave}
              >
                <ThemedText style={[styles.saveButtonText, { color: '#ffffff' }]}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Remove Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRemoveModalVisible}
        onRequestClose={closeRemoveModal}>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: cardBackgroundColor }]}>
            <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
              <ThemedText type="title" style={[styles.modalTitle, { color: textColor }]}>Remove from Inventory</ThemedText>
              <TouchableOpacity onPress={closeRemoveModal}>
                <MaterialIcons name="close" size={24} color={textTertiaryColor} />
              </TouchableOpacity>
            </View>
            
            {selectedItem && (
              <>
                <View style={styles.formGroup}>
                  <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Item Name</ThemedText>
                  <View style={[styles.input, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}>
                    <ThemedText style={{ color: textColor }}>{selectedItem.name}</ThemedText>
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Current Stock</ThemedText>
                  <View style={[styles.input, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}>
                    <ThemedText style={{ color: textColor }}>{selectedItem.stock}</ThemedText>
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Quantity to Remove</ThemedText>
                  <TextInput
                    style={[styles.input, { backgroundColor: cardBackgroundColor, borderColor: borderColor, color: textColor }]}
                    value={quantityToRemove}
                    onChangeText={setQuantityToRemove}
                    placeholder="Enter quantity"
                    placeholderTextColor={textTertiaryColor}
                    keyboardType="numeric"
                    autoFocus
                  />
                </View>
                
                <ThemedText style={[styles.infoText, { color: textSecondaryColor }]}>
                  Enter the number of units you want to remove from inventory
                </ThemedText>
              </>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.cancelButton, { backgroundColor: borderColor }]} 
                onPress={closeRemoveModal}
              >
                <ThemedText style={[styles.cancelButtonText, { color: textSecondaryColor }]}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: dangerColor }]} 
                onPress={handleRemoveSave}
              >
                <ThemedText style={[styles.saveButtonText, { color: '#ffffff' }]}>Remove</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

// Helper function to convert hex to rgb
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemName: {
    flex: 1,
    marginRight: 12,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  skuText: {
    fontWeight: '700',
    fontSize: 16,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockText: {
    fontWeight: '600',
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 16,
  },
  halfFormGroup: {
    flex: 1,
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    fontWeight: '600',
  },
});
